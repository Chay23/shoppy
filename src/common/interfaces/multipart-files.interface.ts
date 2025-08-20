import { FastifyRequest } from 'fastify';

export interface FileUploadValidation {
  maxSize?: number;
  allowedTypes?: string[];
}

export interface FileUploadConfig {
  uploadPath: string;
  filename?: (originalName: string, req: FastifyRequest) => string;
}

export interface FileUploadOptions
  extends FileUploadValidation,
    FileUploadConfig {}
