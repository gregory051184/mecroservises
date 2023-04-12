import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";



// Создаём класс идентификации текущего(авторизованного) пользователя для установки ограничений
@Injectable()
export class Current_user_guard implements CanActivate {

    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest() // получаем запрос
        try {
            // из заголовков запроса получаем токен
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован!!!!!'})
            }
            const user = this.jwtService.verify(token); // расшифровываем токен и получаем информацию о пользователе
            req.user = user; // добавляем пользователя в запрос
            if (req.user.id === req.body.id) { //сравниваем id пользователя из токена и id из запроса
                return true;
            }
            throw new UnauthorizedException({message: 'У Вас нет прав на взаимодействие с этим пользователем'})
        } catch (err) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
    }

}