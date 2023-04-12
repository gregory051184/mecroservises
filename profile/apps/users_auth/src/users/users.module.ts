import {forwardRef, Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {RolesModule} from "../roles/roles.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/userRoles.model";
import {AuthModule} from "../auth/auth.module";
import {ClientsModule, Transport} from "@nestjs/microservices";


@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [ forwardRef( () =>RolesModule),
        ClientsModule.register([
            {
                name: 'USER_AUTH_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'users_queue',
                    noAck: false,
                    queueOptions: {
                        durable: false,
                        //messageTtl: 700000
                    },
                },
            },
        ]),
        SequelizeModule.forFeature([User, Role, UserRoles]),
        forwardRef( () =>AuthModule)],
    exports: [UsersService]
})
export class UsersModule {
}
