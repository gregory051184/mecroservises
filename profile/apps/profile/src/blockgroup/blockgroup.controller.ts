import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {BlockGroupDTO} from "./dto/create_blockGroup_dto";
import {BlockGroupService} from "./blockgroup.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {BlockGroup} from "./blockgroup.model";
import {UpdateBlockGroupDTO} from "./dto/update_blockGroup_dto";
import {Jwt_auth_guard} from "../guards/jwt_auth_guard";


//Этот контроллер для работы с группами блоков.
@ApiTags('Группы блоков')
@Controller('/groups') //эндпоинт для запросов
export class BlockGroupController {

    constructor(private blockGroupService: BlockGroupService) {} //прокидываем BlockGroupService
    // для работы с обработчиками модели BlockGroup

    // Подключаем декораторы для работы визуализации API(@ApiOperation, @ApiResponse) и так для каждого метода.


    // Подключаем декоратор @Post для того, чтобы в запросах работать с методом POST
    // декоратор @Body для того, чтобы вычленять непосредственно тело запроса
    // Метод создаёт экземпляры таблиц blockGroups
    @ApiOperation({summary: 'Создание группы блоков'})
    @ApiResponse({status: 200, type: BlockGroup})
    @Post()
    @UseGuards(Jwt_auth_guard)
    @UsePipes(ValidationPipe)
    create(@Body() dto: BlockGroupDTO) {
        return this.blockGroupService.createBlockGroup(dto);
    }

    // Подключаем декоратор @Put для того, чтобы в запросах работать с методом PUT.
    // Декоратор @Body для того, чтобы вычленять непосредственно тело запроса.
    // Изменяет экземпляр таблицы blockGroups
    @ApiOperation({summary: 'Изменение группы блоков'})
    @ApiResponse({status: 200})
    @Put()
    @UseGuards(Jwt_auth_guard)
    @UsePipes(ValidationPipe)
    update(@Body() dto: UpdateBlockGroupDTO) {
        return this.blockGroupService.updateBlockGroup(dto)
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Метод получает все экземпляры таблицы blockGroups
    @ApiOperation({summary: 'Получение всех групп блоков'})
    @ApiResponse({status: 200, type: [BlockGroup]})
    @Get()
    @UseGuards(Jwt_auth_guard)
    getAll() {
        return this.blockGroupService.getAllBlockGroup();
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Удаляет экземпляр таблицы blockGroups по id
    @ApiOperation({summary: 'Удаление группы блоков'})
    @ApiResponse({status: 200, type: BlockGroup})
    @Delete()
    @UseGuards(Jwt_auth_guard)
    delete(@Body() blockGroup_id: any) {
        return this.blockGroupService.deleteBlockGroup(blockGroup_id.id)
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Удаляет экземпляр таблицы blockGroups по id, только id предаётся в URL
    @ApiOperation({summary: 'Удаление блока по id'})
    @ApiResponse({status: 200, type: BlockGroup})
    @Delete('/:blockGroup_id')
    @UseGuards(Jwt_auth_guard)
    deleteBlockThroughUrlParams(@Param('blockGroup_id') blockGroup_id: any) {
        return this.blockGroupService.deleteBlockGroup(+blockGroup_id);
    }
}
