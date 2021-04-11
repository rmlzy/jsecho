import { resolve, join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as favicon from 'serve-favicon';
import * as csurf from 'csurf';
import { setupSwagger } from './swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipes';
import { isDevelop } from './utils';
import { HttpExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());
  app.use(helmet());
  // app.use(csurf({ cookie: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useStaticAssets({
    root: resolve('./src/views'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      nunjucks: require('nunjucks'),
    },
    root: join(__dirname, '../src/views'),
    viewExt: 'html',
    options: {
      autoescape: true,
      onConfigure: (env) => {
        // env.configure(resolve('./src/views'), { autoescape: true });
      },
    },
  });

  app.enableCors();
  if (isDevelop()) {
    setupSwagger(app);
  }

  const port = app.get('ConfigService').get('SERVER_PORT');
  await app.listen(port);
  console.log(`Server started at http://localhost:${port}!`);
}

bootstrap();
