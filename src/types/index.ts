export type ToolId =
  | 'merge'
  | 'split'
  | 'compress'
  | 'jpg-to-pdf'
  | 'sign'
  | 'pdf-to-markdown'
  | 'word-to-pdf'
  | 'pdf-to-word';

export type ToolCategory = 'all' | 'organize' | 'convert' | 'security' | 'optimize';

export interface ToolInfo {
  id: ToolId;
  title: string;
  description: string;
  icon: string;
  category: ToolCategory;
  accentColor: string;
  badge?: string;
  accept: string;
  multiple: boolean;
  actionText: string;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  previewUrl?: string;
  pageCount?: number;
  sizeFormatted: string;
}

export interface ProgressState {
  stage: string;
  percent: number;
}
