import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

// Создаём класс идентификации текущего(авторизованного) пользователя или администратора для установки ограничений
@Injectable()
export class Current_user_or_admin_guard implements CanActivate {

    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
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
            const roles = req.user.roles.map(role => role.value); // получаем массив ролей пользователя
            const admin = roles.filter(role => role === "ADMIN")
            console.log(req.user.id, req.body.user_id)
            if (req.user.id === req.body.id || req.user.id === req.body.user_id || admin.length > 0) {//сравниваем id пользователя из токена и id из
                // запроса и уточняем есть ли у пользователя права администратора
                return true;
            }
        } catch (err) {
            throw new UnauthorizedException({message: 'Вы не можете удалить этого пользователя'})
        }
    }

}