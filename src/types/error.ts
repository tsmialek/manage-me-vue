export class BadRequest extends Error {
  constructor(message: string = 'There was something wrong with your request') {
    super(message);
    this.name = 'BadRequest';
  }
}

export class ServerError extends Error {
  constructor(message: string = 'Internal server error') {
    super(message);
    this.name = 'ServerError';
  }
}
