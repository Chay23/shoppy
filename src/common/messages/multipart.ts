export const multipartMessages = {
  RequestIsNotMultipart: () => 'Request is not multipart/form-data',
  FilesOnly: () => 'Only files allowed in form-data',
  AtIndex: (index: number) => `Form-data at index ${index}`,
  files: {
    FileRequired: () => 'File is required but was not provided.',
    InvalidFileType: (fileType: string, allowedTypes: string) =>
      `Invalid file type: ${fileType}. Allowed types: ${allowedTypes}`,
    SizeExceeded: (size: number) => `Exceeded max size of ${size} bytes`,
  },
};
