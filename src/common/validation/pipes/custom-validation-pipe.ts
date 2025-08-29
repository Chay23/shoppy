import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

function extractErrors(errors: ValidationError[]) {
  return errors.reduce((accumulator, error) => {
    if (error.children && error.children.length > 0) {
      return {
        ...accumulator,
        [error.property]: extractErrors(error.children),
      };
    }

    if (error.constraints) {
      const message = Object.values(error.constraints)[0];

      return {
        ...accumulator,
        [error.property]: message.charAt(0).toUpperCase() + message.slice(1),
      };
    }
  }, {});
}

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      stopAtFirstError: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException({
          errors: extractErrors(errors),
          error: 'Bad Request',
          statusCode: 400,
        }),
    });
  }
}
