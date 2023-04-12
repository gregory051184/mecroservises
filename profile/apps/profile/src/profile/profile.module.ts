import {Module} from '@nestjs/common';
import {ProfileController} from './profile.controller';
import {ProfileService} from './profile.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [ProfileController],
    providers: [ProfileService],
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        ClientsModule.register([
            {
                name: 'PROFILE_REGISTRATION_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'profile_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
        SequelizeModule.forFeature([Profile])
    ]
})
export class ProfileModule {
}
