import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put, UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {ProfileService} from "./profile.service";
import {ProfileDTO} from "./dto/create_profile_dto";

import {RegistrationDTO} from "./dto/create_registration_dto";
import {UpdateProfileDTO} from "./dto/update_profile_dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Profile} from "./profile.model";
import {ClientProxy, EventPattern} from "@nestjs/microservices";
import {JwtService} from "@nestjs/jwt";
import {Roles} from "../guards/roles_auth.decorator";
import {RolesGuard} from "../guards/roles_guard";
import {Current_user_or_admin_guard} from "../guards/current_user_or_admin_guard";


//Этот контроллер для работы с профилями.
@ApiTags('Профили')
@Controller('profile') //эндпоинт для запросов
export class ProfileController {

    constructor(private profileService: ProfileService,//прокидываем ProfileService
                // для работы с обработчиками модели Profile
                private jwtService: JwtService,
                @Inject('PROFILE_REGISTRATION_SERVICE') private readonly client: ClientProxy) {
    }

    // Подключаем декораторы для работы визуализации API(@ApiOperation, @ApiResponse) и так для каждого метода.

    @ApiOperation({
        summary: 'ВАЖНО! Регистрация пользователя + автоматическая авторизация пользователя + ' +
            'регистрация профиля через передачу user_id из jwt-token'
    })
    @ApiResponse({status: 200, type: Profile})
    @Post()
    async user_registration(@Body() dto: RegistrationDTO) {
        this.client.emit('user_registration', {dto: dto});
    }

    @EventPattern('profile_registration')
    async profile_registration(dto: any) {
        const {regDto, token} = dto
        const profile = await this.profileService.registrationThroughAuth(regDto, token);
        return profile
    }

    // Подключаем декоратор @Post для того, чтобы в запросах работать с методом POST
    // декоратор @Body для того, чтобы вычленять непосредственно тело запроса
    // Метод создаёт экземпляры экземпляры таблицы users и таблиц profiles по user_id,
    // который был взят из токена при авто авторизации пользователя
    //@ApiOperation({summary: 'ВАЖНО! Регистрация пользователя + автоматическая авторизация пользователя + ' +
    //        'регистрация профиля через передачу user_id из jwt-token'})
    //@ApiResponse({status: 200, type: Profile})
    //@Post('/auth_registration')
    //@UsePipes(ValidationPipe)
    //registrationThroughAuth(@Body() dto: RegistrationDTO) {
    //    console.log(dto)
    //    return this.profileService.registrationThroughAuth(dto);
    //}

    // ВТОРОЙ МЕТОД РЕГИСТРАЦИИ
    // Подключаем декоратор @Post для того, чтобы в запросах работать с методом POST
    // декоратор @Body для того, чтобы вычленять непосредственно тело запроса
    // Метод создаёт экземпляры экземпляры таблицы users и таблиц profiles по user_id,
    // без авторизации  @ApiOperation({summary: 'ВАЖНО! Регистрация пользователя
    // регистрация профиля через передачу user_id без jwt-token и авторизации'})
    //@ApiResponse({status: 200, type: Profile})
    //@Post('/registration')
    //@UsePipes(ValidationPipe)
    //registration(@Body() dto: RegistrationDTO) {
    //    return this.profileService.registration(dto);
    //}

    // Подключаем декоратор @Post для того, чтобы в запросах работать с методом POST
    // декоратор @Body для того, чтобы вычленять непосредственно тело запроса
    // Подключаем декоратор @Roles добавляя в него
    // роль "ADMIN" и RolesGuard для проверки пользователя на статус администратора
    // Метод создаёт экземпляры таблиц profile
    @ApiOperation({summary: 'Создание профиля (должна быть роль администратора)'})
    @ApiResponse({status: 200, type: Profile})
    @Post()
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @UsePipes(ValidationPipe)
    create(@Body() dto: ProfileDTO) {
        return this.profileService.createProfile(dto);
    }

    // Подключаем декоратор @Put для того, чтобы в запросах работать с методом PUT.
    // Декоратор @Body для того, чтобы вычленять непосредственно тело запроса.
    // Current_user_or_admin_guard проверяет, относится ли пользователь к этому профилю
    // или является ли пользователь администратором
    // Изменяет экземпляр таблицы profiles
    @ApiOperation({
        summary: 'Изменение профиля (должен быть либо сам пользователь,' +
            ' либо роль администратора)'
    })
    @ApiResponse({status: 200})
    @Put()
    @UseGuards(Current_user_or_admin_guard)
    @UsePipes(ValidationPipe)
    update(@Body() dto: UpdateProfileDTO) {
        return this.profileService.updateProfile(dto);
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Current_user_or_admin_guard проверяет, относится ли пользователь к этому профилю
    // или является ли пользователь администратором
    // Удаляет экземпляр таблицы profiles по id
    @ApiOperation({
        summary: 'Удаление профиля (должен быть либо сам пользователь,' +
            ' либо роль администратора)'
    })
    @ApiResponse({status: 200, type: Profile})
    @UseGuards(Current_user_or_admin_guard)
    @Delete()
    delete(@Body() profile_id: any) {
        const profile = this.profileService.deleteProfile(+profile_id.id);
        this.profileService.getProfileById(profile_id.id)
            .then(profile => {
                this.client.emit('delete_user', {user_id: profile.dataValues['user_id']})
            });
        return profile;
    }

    @EventPattern('delete_profile')
    async delete_user_through_profile_id(user_id: any) {
        await this.profileService.getProfileByUser_Id(+user_id.user_id)
            .then(profile => {
                this.profileService.deleteProfile(+profile.dataValues['id']);
            })
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Удаляет экземпляр таблицы profiles по id, только id предаётся в URL
    @ApiOperation({summary: 'Удаление блока по id'})
    @ApiResponse({status: 200, type: Profile})
    @UseGuards(Current_user_or_admin_guard)
    @Delete('/:profile_id')
    async deleteProfileThroughUrlParams(@Param('profile_id') profile_id: number) {
        await this.profileService.getProfileById(+profile_id)
            .then(profile => {
                this.client.emit('delete_user', {user_id: profile.dataValues['user_id']})
                this.profileService.deleteProfile(profile.dataValues['id'])
            })
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Подключаем декоратор @Roles добавляя в него
    // роль "ADMIN" и RolesGuard для проверки пользователя на статус администратора
    // Метод получает все экземпляры таблицы profiles
    @ApiOperation({summary: 'Получение всех профилей (только роль администратора)'})
    @ApiResponse({status: 200, type: [Profile]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAllProfile() {
        return this.profileService.getAllProfiles();
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Current_user_or_admin_guard проверяет, относится ли пользователь к этому профилю
    // или является ли пользователь администратором
    // Метод получает экземпляр таблицы profiles по id
    @ApiOperation({
        summary: 'Получение профиля по id (должен быть либо сам пользователь,' +
            ' либо роль администратора)'
    })
    @ApiResponse({status: 200, type: Profile})
    @UseGuards(Current_user_or_admin_guard)
    @Get('/:profile_id')
    getOwnProfile(@Param('profile_id') profile_id: number) {
        return this.profileService.getProfileById(profile_id);
    }
}
