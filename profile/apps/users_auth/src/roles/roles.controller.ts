import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {RoleDTO} from "./dto/create_role_dto";
import {Roles} from "../auth/roles_auth.decorator";
import {RolesGuard} from "../guards/roles_guard";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Role} from "./roles.model";
import {UpdateRoleDTO} from "./dto/update_role_dto";
import {ClientProxy} from "@nestjs/microservices";



//Этот контроллер для работы с ролями.
@ApiTags('Роли')
@Controller('roles') //эндпоинт для запросов
export class RolesController {

    constructor(private rolesService: RolesService) {} //прокидываем RolesService
    // для работы с обработчиками модели Role

    // Подключаем декораторы для работы визуализации API(@ApiOperation, @ApiResponse) и так для каждого метода.


    // Подключаем декоратор @Post для того, чтобы в запросах работать с методом POST
    // декоратор @Body для того, чтобы вычленять непосредственно тело запроса
    // Подключаем декоратор @Roles добавляя в него
    // роль "ADMIN" и RolesGuard для проверки пользователя на статус администратора
    // Метод создаёт экземпляры таблиц roles
    @ApiOperation({summary: 'Создание роли (необходима роль администратора)'})
    @ApiResponse({status: 200, type: Role})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post()
    @UsePipes(ValidationPipe)
    create(@Body() dto: RoleDTO) {
        return this. rolesService.createRole(dto);
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Метод получает все экземпляры таблицы roles
    @ApiOperation({summary: 'Получение всех ролей'})
    @ApiResponse({status: 200, type: [Role]})
    @Get()
    getAllRoles() {
        return this.rolesService.getAllRoles();
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Метод получает экземпляр модели Role по id
    @ApiOperation({summary: 'Получение роли'})
    @ApiResponse({status: 200, type: Role})
    @Get('/:value')
    getRoleByValue(@Param('value') value: string) {
        return this.rolesService.getRoleByValue(value);
    }

    // Подключаем декоратор @Put для того, чтобы в запросах работать с методом PUT.
    // Декоратор @Body для того, чтобы вычленять непосредственно тело запроса.
    // Подключаем декоратор @Roles добавляя в него
    // роль "ADMIN" и RolesGuard для проверки пользователя на статус администратора
    // Изменяет экземпляр таблицы roles
    @ApiOperation({summary: 'Изменение роли (необходима роль администратора)'})
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Put()
    @UsePipes(ValidationPipe)
    updateRole(@Body() dto: UpdateRoleDTO) {
        return this.rolesService.updateRole(dto);
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Подключаем декоратор @Roles добавляя в него
    // роль "ADMIN" и RolesGuard для проверки пользователя на статус администратора
    // Удаляет экземпляр таблицы roles по id
    @ApiOperation({summary: 'Удаление роли (необходима роль администратора)'})
    @ApiResponse({status: 200, type: Role})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete()
    deleteRole(@Body() role_id: any) {
        return this.rolesService.deleteRole(role_id.id);
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Удаляет экземпляр таблицы roles по id, только id предаётся в URL
    @ApiOperation({summary: 'Удаление блока по id'})
    @ApiResponse({status: 200, type: Role})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Delete('/:role_id')
    deleteBlockThroughUrlParams(@Param('role_id') role_id: any) {
        return this.rolesService.deleteRole(+role_id);
    }
}
