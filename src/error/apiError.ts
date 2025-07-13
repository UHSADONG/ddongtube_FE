import { HttpErrorStatus } from '@/types/error';

export class ApiError<T = unknown> extends Error {
  status: HttpErrorStatus | number;
  statusText: string;
  message: string;
  code: string;
  response: T | null;

  constructor(
    status: HttpErrorStatus,
    statusText: string,
    message: string,
    code: string,
    response: T | null,
  ) {
    super(`Unexpected Error: ${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.message = message;
    this.code = code;

    switch (status) {
      case 400:
        this.name = 'ApiBadRequestError';
        break;
      case 401:
        this.name = 'ApiUnauthorizedError';
        break;
      case 403:
        this.name = 'ApiForbiddenError';
        break;
      case 404:
        this.name = 'ApiNotFoundError';
        break;
      case 413:
        this.name = 'ApiRequestEntityTooLargeError';
        break;
      case 429:
        this.name = 'ApiTooManyRequestsError';
        break;
      case 500:
        this.name = 'ApiInternalServerError';
        break;
      default:
        this.name = 'ApiError';
    }
  }
}
