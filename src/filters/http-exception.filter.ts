import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let message = exception.message;
    if (status === 401) {
      message = '未检测到认证信息';
    }
    if (status === 403) {
      message = '无权访问';
    }
    if (status === 404) {
      message = '资源不存在';
    }
    if (status === 500) {
      message = '内部服务器错误';
    }
    response.status(200).json({
      code: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
