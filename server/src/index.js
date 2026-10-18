import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export function isValidDocxBuffer(buffer) {
  if (!buffer || buffer.length < 4) return false;
  // ZIP signature: PK\x03\x04 or empty PK\x05\x06 or spanned PK\x07\x08
  return (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07)
  );
}

export function isValidPdfBuffer(buffer) {
  if (!buffer || buffer.length < 4) return false;
  // PDF signature: %PDF
  return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
}

export function getAllowedCorsOrigins(envOrigin) {
  if (envOrigin) {
    return envOrigin.split(',').map((o) => o.trim()).filter(Boolean);
  }
  return [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];
}

export function buildLibreOfficeArgs({ tempDir, inputPath, format, inFilter }) {
  const profileUri = `file://${path.join(tempDir, 'user_profile').replace(/\\/g, '/')}`;
  const args = [
    `-env:UserInstallation=${profileUri}`,
    '--headless',
    '--norestore',
    '--nofirststartwizard',
    '--nologo',
    '--nodefault',
  ];
  if (inFilter) {
    args.push(`--infilter=${inFilter}`);
  }
  args.push('--convert-to', format, '--outdir', tempDir, inputPath);
  return args;
}

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = getAllowedCorsOrigins(process.env.CORS_ORIGIN);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin tidak diizinkan oleh kebijakan CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

const MAX_CONCURRENT_CONVERSIONS = parseInt(process.env.MAX_CONCURRENT_CONVERSIONS || '3', 10);
let activeConversions = 0;

function getLibreOfficeCandidates() {
  const candidates = [];
  if (process.env.LIBREOFFICE_PATH) {
    candidates.push(process.env.LIBREOFFICE_PATH);
  }
  candidates.push(
    'soffice',
    'libreoffice',
    '/usr/bin/soffice',
    '/usr/bin/libreoffice',
    '/usr/lib/libreoffice/program/soffice',
    '/Applications/LibreOffice.app/Contents/MacOS/soffice',
    '/opt/homebrew/bin/soffice'
  );
  return candidates;
}

async function findLibreOfficeBinary() {
  const candidates = getLibreOfficeCandidates();
  for (const bin of candidates) {
    try {
      await new Promise((resolve, reject) => {
        execFile(bin, ['--version'], { timeout: 3000 }, (error, stdout) => {
          if (error) return reject(error);
          resolve(stdout);
        });
      });
      return bin;
    } catch {
      // Continue checking next candidate
    }
  }
  return null;
}

app.get('/api/health', async (_req, res) => {
  const binary = await findLibreOfficeBinary();
  res.json({
    status: 'ok',
    service: 'andesa-pdf-backend',
    engine: binary ? 'libreoffice' : 'unavailable',
    libreofficePath: binary,
  });
});

app.post('/api/convert/word-to-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada berkas yang diunggah' });
  }

  const originalName = req.file.originalname || 'document.docx';
  if (!originalName.toLowerCase().endsWith('.docx')) {
    return res.status(400).json({ error: 'Format berkas harus berupa .docx' });
  }

  if (!isValidDocxBuffer(req.file.buffer)) {
    return res.status(400).json({
      error: 'Format berkas rusak atau signature bukan dokumen DOCX yang valid',
    });
  }

  if (activeConversions >= MAX_CONCURRENT_CONVERSIONS) {
    return res.status(503).json({
      error: 'Layanan konversi sedang sibuk. Silakan coba kembali dalam beberapa saat.',
    });
  }

  const binary = await findLibreOfficeBinary();
  if (!binary) {
    return res.status(503).json({
      error: 'LibreOffice tidak tersedia di server. Silakan jalankan via Docker atau install LibreOffice.',
    });
  }

  activeConversions++;
  const randomId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), `andesa-pdf-${randomId}`);
  await fs.mkdir(tempDir, { recursive: true });

  const inputPath = path.join(tempDir, 'input.docx');
  const baseName = path.parse(originalName).name;
  const expectedPdfPath = path.join(tempDir, 'input.pdf');

  try {
    await fs.writeFile(inputPath, req.file.buffer);

    const args = buildLibreOfficeArgs({ tempDir, inputPath, format: 'pdf' });
    await new Promise((resolve, reject) => {
      execFile(binary, args, { timeout: 45000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('LibreOffice conversion failed:', stderr || error.message);
          return reject(new Error('Gagal mengonversi dokumen Word ke PDF'));
        }
        resolve(stdout);
      });
    });

    const pdfBuffer = await fs.readFile(expectedPdfPath);
    const encodedFilename = encodeURIComponent(`${baseName}-converted.pdf`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('API word-to-pdf error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses konversi dokumen' });
  } finally {
    activeConversions = Math.max(0, activeConversions - 1);
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
});

app.post('/api/convert/pdf-to-word', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada berkas yang diunggah' });
  }

  const originalName = req.file.originalname || 'document.pdf';
  if (!originalName.toLowerCase().endsWith('.pdf')) {
    return res.status(400).json({ error: 'Format berkas harus berupa .pdf' });
  }

  if (!isValidPdfBuffer(req.file.buffer)) {
    return res.status(400).json({
      error: 'Format berkas rusak atau signature bukan dokumen PDF yang valid',
    });
  }

  if (activeConversions >= MAX_CONCURRENT_CONVERSIONS) {
    return res.status(503).json({
      error: 'Layanan konversi sedang sibuk. Silakan coba kembali dalam beberapa saat.',
    });
  }

  const binary = await findLibreOfficeBinary();
  if (!binary) {
    return res.status(503).json({
      error: 'LibreOffice tidak tersedia di server. Silakan jalankan via Docker atau install LibreOffice.',
    });
  }

  activeConversions++;
  const randomId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), `andesa-pdf-${randomId}`);
  await fs.mkdir(tempDir, { recursive: true });

  const inputPath = path.join(tempDir, 'input.pdf');
  const baseName = path.parse(originalName).name;
  const expectedDocxPath = path.join(tempDir, 'input.docx');

  try {
    await fs.writeFile(inputPath, req.file.buffer);

    const args = buildLibreOfficeArgs({
      tempDir,
      inputPath,
      format: 'docx',
      inFilter: 'writer_pdf_import',
    });
    await new Promise((resolve, reject) => {
      execFile(binary, args, { timeout: 45000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('LibreOffice conversion failed:', stderr || error.message);
          return reject(new Error('Gagal mengonversi dokumen PDF ke Word'));
        }
        resolve(stdout);
      });
    });

    const docxBuffer = await fs.readFile(expectedDocxPath);
    const encodedFilename = encodeURIComponent(`${baseName}-converted.docx`);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"`);
    res.send(docxBuffer);
  } catch (err) {
    console.error('API pdf-to-word error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses konversi dokumen' });
  } finally {
    activeConversions = Math.max(0, activeConversions - 1);
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Andesa PDF Backend running on http://localhost:${PORT}`);
  });
}

export { app };
