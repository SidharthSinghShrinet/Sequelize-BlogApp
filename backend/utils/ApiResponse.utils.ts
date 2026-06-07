import express from "express";

class ApiResponse<T = unknown> {
  private statusCode: number;
  readonly success: boolean;
  readonly message: string;
  readonly data: T | null;
  readonly meta: Record<string, unknown> | null;
  constructor(
    statusCode: number,
    success: boolean,
    message: string,
    data: T | null = null,
    meta: Record<string, unknown> | null = null,
  ) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  send(res: express.Response): express.Response {
    let response: any = {};
    response.success = this.success;
    response.message = this.message;
    if (this.data) {
      response.data = this.data;
    }
    if (this.meta) {
      response.meta = this.meta;
    }
    return res.status(this.statusCode).json(response);
  }
}

export default ApiResponse;
