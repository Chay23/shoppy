import { MultipartFile } from '@fastify/multipart';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

interface FastifyRequestWithFile extends FastifyRequest {
  uploadedFile?: MultipartFile;
}

export const UploadedFile = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<FastifyRequestWithFile>().uploadedFile,
);
