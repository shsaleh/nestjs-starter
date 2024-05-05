import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
export async function bootstrap(AppModule) {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('personal planner')
    .setDescription('a personal planner platform')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addSecurityRequirements('access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (
        Array.isArray(method.security) &&
        method.security.includes('public')
      ) {
        method.security = [];
      }
    });
  });

  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.PORT);
}
