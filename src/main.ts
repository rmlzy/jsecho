import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import { setupSwagger } from './swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes/validation.pipe';
import { isDevelop } from './utils';
import { HttpExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());
  app.use(helmet());
  // app.use(csurf({ cookie: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useStaticAssets(resolve('./src/public'), {
    prefix: '/public/',
  });

  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('hbs');
  app.enableCors();

  if (isDevelop()) {
    setupSwagger(app);
  }

  const port = app.get('ConfigService').get('SERVER_PORT');
  await app.listen(port);
  console.log(`Server started at ${port}!`);
}

bootstrap();
