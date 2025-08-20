import { Multipart, MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';
import { BadRequestException } from '@nestjs/common';
import {
  FileUploadOptions,
  FileUploadValidation,
} from '../interfaces/multipart-files.interface';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { unlink } from 'fs/promises';
import { multipartMessages } from '../messages/multipart';

export const isMultipartFile = (
  fileData: Multipart,
  index?: number,
): fileData is MultipartFile => {
  if (fileData.type !== 'file')
    throw new BadRequestException(
      `${index ? multipartMessages.AtIndex(index) : ''}: ${multipartMessages.FilesOnly()}`,
    );
  return true;
};

export const isMultipartFileStreamExists = (
  fileData: MultipartFile | undefined,
  index?: number,
): fileData is MultipartFile => {
  if (!fileData)
    throw new BadRequestException(
      `${index ? multipartMessages.AtIndex(index) : ''}: ${multipartMessages.files.FileRequired()}`,
    );
  return true;
};

export const isMultipartFileProvided = (
  fileData: MultipartFile,
  index?: number,
) => {
  if (fileData.filename === '')
    throw new BadRequestException(
      `${index ? multipartMessages.AtIndex(index) : ''}: ${multipartMessages.files.FileRequired()}`,
    );
  return true;
};

export const isMultipartFileTypeValid = (
  fileData: MultipartFile,
  allowedTypes: FileUploadValidation['allowedTypes'],
) => {
  if (allowedTypes?.length && !allowedTypes?.includes(fileData.mimetype))
    throw new BadRequestException(
      `${fileData.filename}: ${multipartMessages.files.InvalidFileType(fileData.mimetype, allowedTypes.join(', '))}`,
    );

  return true;
};

export const fileSizeChecker = (maxSize: number) => {
  return async function* (source: AsyncIterable<Buffer>) {
    let uploadedBytes = 0;
    for await (const chunk of source) {
      uploadedBytes += chunk.length;
      if (uploadedBytes > maxSize) {
        throw new Error(multipartMessages.files.SizeExceeded(maxSize));
      }
      yield chunk;
    }
  };
};

export const saveFile = async (
  fileData: MultipartFile,
  req: FastifyRequest,
  options: FileUploadOptions,
) => {
  const uploadedFiles: MultipartFile[] = [];
  const uploadedPaths: string[] = [];

  const fileName = options.filename
    ? options.filename(fileData.filename, req)
    : fileData.filename;
  fileData.filename = fileName;
  const filePath = join(options.uploadPath, fileName);

  try {
    const streams: any[] = [fileData.file];

    if (options.maxSize) {
      streams.push(fileSizeChecker(options.maxSize));
    }

    const writeStream = createWriteStream(filePath);
    streams.push(writeStream);
    uploadedPaths.push(filePath);

    await pipeline.apply(null, streams);
    uploadedFiles.push(fileData);
  } catch (err) {
    throw new BadRequestException(`${fileData.filename}: ${err.message}`);
  }

  return { uploadedFiles, uploadedPaths };
};

export const deleteFiles = (filePaths: string[]) => {
  for (const path in filePaths) {
    unlink(path);
  }
};
