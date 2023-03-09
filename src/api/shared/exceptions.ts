export class BadRequestException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);
  }
}
