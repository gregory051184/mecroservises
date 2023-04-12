import {Body, Controller, Inject, Post, Req, Res, UsePipes, ValidationPipe} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserDTO} from "../users/dto/create_user_dto";

import {AuthService} from "./auth.service";
import {ClientProxy} from "@nestjs/microservices";

//Этот контроллер для работы с авторизацией.
@ApiTags('Авторизация')
@Controller('/auth') //эндпоинт для запросов
export class AuthController {

    constructor(private authService: AuthService) {} //прокидываем AuthService
    // для работы с обработчиками модели User

    // Подключаем декораторы для работы визуализации API(@ApiOperation, @ApiResponse) и так для каждого метода.


    // Подключаем декоратор @Post для того, чтобы в запросах работать с методом POST
    // декоратор @Body для того, чтобы вычленять непосредственно тело запроса
    // Метод проводит авторизацию пользователей
    @ApiOperation({summary: 'Авторизация. Происходит через email и password пользователя'})
    @ApiResponse({status: 200})
    @Post('/login')
    @UsePipes(ValidationPipe)
    login(@Body() dto: UserDTO, @Req() req: Request) {
        //console.log(req.headers['authorization'])
        //console.log(this.authService.login(dto))
        return this.authService.login(dto);
    }

}
