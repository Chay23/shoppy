import { MultipartFile } from '@fastify/multipart';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

interface FastifyRequestWithFiles extends FastifyRequest {
  uploadedFiles?: MultipartFile[];
}

export const UploadedFiles = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<FastifyRequestWithFiles>().uploadedFiles,
);
