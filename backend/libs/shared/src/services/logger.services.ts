import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string, context?: any) {
    console.log(
      JSON.stringify({ message, context, timestamp: new Date().toISOString() }),
    );
  }

  error(message: string, trace: string, context?: any) {
    console.error(
      JSON.stringify({
        message,
        trace,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
