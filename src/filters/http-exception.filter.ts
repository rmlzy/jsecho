import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    console.log("-----------------------------");
    console.log(exception);
    console.log("-----------------------------");
    reply.code(200).send({
      code: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
