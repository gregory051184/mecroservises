import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService, JwtModule],
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        forwardRef(() => UsersModule)
    ]
})
export class AuthModule {
}
