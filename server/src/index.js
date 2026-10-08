import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

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

  const binary = await findLibreOfficeBinary();
  if (!binary) {
    return res.status(503).json({
      error: 'LibreOffice tidak tersedia di server. Silakan jalankan via Docker atau install LibreOffice.',
    });
  }

  const randomId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), `andesa-pdf-${randomId}`);
  await fs.mkdir(tempDir, { recursive: true });

  const inputPath = path.join(tempDir, 'input.docx');
  const baseName = path.parse(originalName).name;
  const expectedPdfPath = path.join(tempDir, 'input.pdf');

  try {
    await fs.writeFile(inputPath, req.file.buffer);

    await new Promise((resolve, reject) => {
      execFile(
        binary,
        ['--headless', '--convert-to', 'pdf', '--outdir', tempDir, inputPath],
        { timeout: 45000 },
        (error, stdout, stderr) => {
          if (error) {
            return reject(new Error(`Konversi gagal: ${stderr || error.message}`));
          }
          resolve(stdout);
        }
      );
    });

    const pdfBuffer = await fs.readFile(expectedPdfPath);
    const encodedFilename = encodeURIComponent(`${baseName}-converted.pdf`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan internal konversi';
    res.status(500).json({ error: message });
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
});

app.listen(PORT, () => {
  console.log(`Andesa PDF Backend running on http://localhost:${PORT}`);
});
