import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import {
  deleteFiles,
  isMultipartFileStreamExists,
  isMultipartFileTypeValid,
  saveFile,
} from 'src/common/utils/multipart-files';
import { FileUploadOptions } from 'src/common/interfaces/multipart-files.interface';
import { multipartMessages } from 'src/common/messages/multipart';

export class FilesUploadInterceptor implements NestInterceptor {
  constructor(private readonly options: FileUploadOptions) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest<FastifyRequest>();

    if (!req.isMultipart()) {
      throw new BadRequestException(multipartMessages.RequestIsNotMultipart());
    }

    const fileData = await req.file();
    let currentUploadedPath: string[] = [];

    try {
      if (
        isMultipartFileStreamExists(fileData) &&
        isMultipartFileTypeValid(fileData, this.options.allowedTypes)
      ) {
        const { uploadedFiles, uploadedPaths } = await saveFile(
          fileData,
          req,
          this.options,
        );
        currentUploadedPath = uploadedPaths;
        (req as any).uploadedFile = uploadedFiles[0];
      }
    } catch (err) {
      deleteFiles(currentUploadedPath);
      throw err;
    }

    return next.handle();
  }
}
