export class HttpException extends Error {
  statusCode: number;
  success: boolean;

  constructor(statusCode: number, message: string, success: boolean = false) {
    super();

    this.success = false;
    this.message = message;
    this.statusCode = statusCode;
  }
}
