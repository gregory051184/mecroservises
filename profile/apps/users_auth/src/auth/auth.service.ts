import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserDTO} from "../users/dto/create_user_dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import {User} from "../users/users.model";


@Injectable()
export class AuthService {

    constructor(private usersService: UsersService,
                private jwtService: JwtService) {
    }

    // Метод по авторизации пользователя, который возвращает jwt-token
    async login(dto: UserDTO) {
        const user = await this.validateUser(dto);
        const user_token = await this.generateToken(user)
        //await this.sendAuthToken(user_token);
        return user_token;
    }

    // Метод, который записывает в token информацию о пользователе и возвращает этот token
    async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    // Метод, который проверяет пароль пользователя и возвращает пользователя при совпадении паролей
    private async validateUser(dto: UserDTO) {
        const user = await this.usersService.getUserByEmail(dto.email);
        const passwordEquals = await bcrypt.compare(dto.password, user.password)
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный email или пароль'})
    }
    //private async sendAuthToken(token: any) {
    //    await amqp.connect('amqp://localhost', function (error0, connection): any {
    //        if (error0) {
    //            throw error0;
    //        }
    //        connection.createChannel(function (error1, channel) {
    //            if (error1) {
    //                throw error1;
    //            }
    //            let queue = 'authenticated_users';
    //            let msg = token;
//
    //            channel.assertQueue(queue, {
    //                durable: false
    //            });
//
    //            channel.sendToQueue(queue, Buffer.from(msg));
    //            console.log(" [x] Sent %s", msg);
    //            setTimeout(() => {
    //                connection.close()
    //            }, 1000)
    //        });
    //    });
    //}
}
