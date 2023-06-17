import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as promBundle from 'express-prom-bundle';
import * as session from 'express-session';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { jwtConstants } from './auth/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser: true,
  });
  app.use(
    session({
      secret: jwtConstants.secret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };
  app.enableCors(corsOptions);

  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
  });
  app.use(metricsMiddleware);
  await app.listen(3000);
}
bootstrap();
