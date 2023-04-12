import {NestFactory} from "@nestjs/core";
import {AppModule} from "../app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function main() {
  const PORT = 8000 || 3000;
  const app = await NestFactory.create(AppModule);
  //const app = await NestFactory.createMicroservice(AppModule, {
  //  transport: Transport.RMQ,
  //  options: {
  //    urls: ['amqp://localhost:5672'],
  //    queue: 'users_queue',
  //    queueOptions: {
  //      durable: false
  //    },
  //  },
  //});

 const config = new DocumentBuilder()
     .setTitle('Задание по созданию NestJS')
     .setDescription('API')
     .setVersion('1.0.0')
     .build()

 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('/api/docs', app, document);
  await app.listen(PORT, () => console.log(`Сервер Users_Auth запущен на порте ${PORT}`))
  //await app.listen();
}

main();
