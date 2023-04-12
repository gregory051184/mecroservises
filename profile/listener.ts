import {NestFactory} from "@nestjs/core";
import {AppModule} from "./apps/profile/app.module";
import {Transport} from "@nestjs/microservices";

async function main() {

    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://localhost:5672'],
            queue: 'users_queue',
            queueOptions: {
                durable: false
            },
        },
    });

    await app.listen();
}

main();