import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import {Request, Response} from 'express'

@Catch()
export class AllExceptionFiler implements ExceptionFilter{
    // constructor(private readonly httAdapterHost : HttpAdapterHost){}

    catch(exception: HttpException, host: ArgumentsHost) : void{
        // console.log('Catch Block')
        // console.log(message);
        // const {httpAdapter} = this.httAdapterHost;

        console.log(exception)
        const ctx = host.switchToHttp()
        const request = ctx.getResponse<Request>();
        const response = ctx.getResponse<Response>();

        const httpStatus =  exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        // const message = exception instanceof HttpException ? exception.message : 'Something went Wrong';

        const responseBody = {
            statusCode : httpStatus,
            message : exception.message ? exception.message : 'Something went wrong',
            path : request.url
        }
        response.status(httpStatus).send(responseBody);

        // httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }

}