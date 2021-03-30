import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_2_HOURS)
  testSchedule() {
    this.logger.debug(Date());
  }
}
