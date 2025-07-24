import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerDocumentConfig = new DocumentBuilder()
  .setTitle('nest-demo')
  .setDescription('nest-demo')
  .setVersion('1')
  .build();

export function setupSwaggerDocument(app: INestApplication) {
  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentConfig,
  );

  SwaggerModule.setup('/api-docs', app, swaggerDocument);
}
