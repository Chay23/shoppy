import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { unlink } from 'fs/promises';
import {
  isMultipartFile,
  isMultipartFileProvided,
  isMultipartFileTypeValid,
  saveFile,
} from 'src/common/utils/multipart-files';
import { FileUploadOptions } from 'src/common/interfaces/multipart-files.interface';
import { multipartMessages } from 'src/common/messages/multipart';
import { MultipartFile } from '@fastify/multipart';

export class FilesUploadInterceptor implements NestInterceptor {
  constructor(private readonly options: FileUploadOptions) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const parts = req.parts();
    let currentUploadedFiles: MultipartFile[] = [];
    let currentUploadedPaths: string[] = [];
    let formDataIndex = 0;

    if (!req.isMultipart()) {
      throw new BadRequestException(multipartMessages.RequestIsNotMultipart());
    }

    try {
      for await (const part of parts) {
        formDataIndex++;
        if (
          isMultipartFile(part, formDataIndex) &&
          isMultipartFileProvided(part, formDataIndex) &&
          isMultipartFileTypeValid(part, this.options.allowedTypes)
        ) {
          const { uploadedFiles, uploadedPaths } = await saveFile(
            part,
            req,
            this.options,
          );
          currentUploadedFiles = uploadedFiles;
          currentUploadedPaths = uploadedPaths;

          (req as any).uploadedFiles = currentUploadedFiles;
        }
      }
    } catch (err) {
      for (const filePath of currentUploadedPaths) {
        unlink(filePath);
      }
      throw err;
    }

    return next.handle();
  }
}
