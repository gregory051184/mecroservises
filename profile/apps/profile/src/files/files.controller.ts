import {
    Body,
    Controller,
    Delete,
    Get, Param,
    Post, Put,
    UploadedFiles, UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {FilesService} from "./files.service";
import {FilesDTO} from "./dto/create_file_dto";
import {FilesInterceptor} from "@nestjs/platform-express";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {File} from "./files.model";
import {UpdateFilesDTO} from "./dto/update_file_dto";
import {Jwt_auth_guard} from "../guards/jwt_auth_guard";


//Этот контроллер для работы с таблицей files.
@ApiTags('Файлы')
@Controller('files') //эндпоинт для запросов
export class FilesController {

    constructor(private filesService: FilesService) {} //прокидываем FilesService
    // для работы с обработчиками модели File

    // Подключаем декораторы для работы визуализации API(@ApiOperation, @ApiResponse) и так для каждого метода.


    // Подключаем декоратор @Post для того, чтобы в запросах работать с методом POST
    // декоратор @Body для того, чтобы вычленять непосредственно тело запроса
    // декораторы @UseInterceptors и @UploadedFiles() дают возможность работать с массивами файлов
    // Метод создаёт экземпляры таблицы files
    @ApiOperation({summary: 'Запись файлов в БД'})
    @ApiResponse({status: 200, type: File})
    @Post()
    @UseGuards(Jwt_auth_guard)
    @UseInterceptors(FilesInterceptor('file'))
    create(@UploadedFiles() file, @Body() dto: FilesDTO) {
        return this.filesService.createFile(file, dto);
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Метод получает все экземпляры таблицы files
    @ApiOperation({summary: 'Получение всех файлов'})
    @ApiResponse({status: 200, type: [File]})
    @Get()
    @UseGuards(Jwt_auth_guard)
    getAllFiles() {
        return this.filesService.getAllFiles();
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Метод получает все экземпляры таблицы files, которые были созданы более 1 часа
    @ApiOperation({summary: 'Получение файлов, которые были занесены в БД больше часа назад'})
    @ApiResponse({status: 200, type: [File]})
    @Get('/extra')
    @UseGuards(Jwt_auth_guard)
    getOutOfTime() {
        return this.filesService.getOutOfTimeFiles();
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Метод получает все экземпляры таблицы files, которые не имеют essenceTable или essenceId
    @ApiOperation({summary: 'Получение файлов, которые были занесены в БД без уточнения таблицы' +
            ' и id экземпляра этой таблицы'})
    @ApiResponse({status: 200, type: [File]})
    @Get('/unused')
    @UseGuards(Jwt_auth_guard)
    getUnused() {
        return this.filesService.getUnusedFiles();
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Метод получает все экземпляры таблицы files, которые не имеют essenceTable
    // или essenceId или которые были созданы более 1 часа
    @ApiOperation({summary: 'Получение файлов, которые были занесены в БД больше часа назад,' +
            ' а также без уточнения таблицы и id экземпляра этой таблицы'})
    @ApiResponse({status: 200, type: [File]})
    @Get('/all/trash')
    @UseGuards(Jwt_auth_guard)
    getAllTrash() {
        return this.filesService.getAllTrashFiles();
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом Delete
    // Метод удаляет все экземпляры таблицы files, которые не имеют essenceTable
    // или essenceId или которые были созданы более 1 часа
    @ApiOperation({summary: 'Удаление файлов, которые были занесены в БД больше часа назад,' +
            ' а также без уточнения таблицы и id экземпляра этой таблицы'})
    @ApiResponse({status: 200, type: [File]})
    @Delete('/delete/all/trash')
    @UseGuards(Jwt_auth_guard)
    deleteAllTrash() {
        return this.filesService.deleteAllTrashFiles();
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом Delete
    // Метод удаляет экземпляр таблицы files по id
    @ApiOperation({summary: 'Удаление файла'})
    @ApiResponse({status: 200, type: File})
    @Delete()
    @UseGuards(Jwt_auth_guard)
    deleteFile(@Body() file_id: any) {
        return this.filesService.deleteFileById(file_id.id);
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Удаляет экземпляр таблицы files по id, только id предаётся в URL
    @ApiOperation({summary: 'Удаление блока по id'})
    @ApiResponse({status: 200, type: File})
    @Delete('/:file_id')
    @UseGuards(Jwt_auth_guard)
    deleteBlockThroughUrlParams(@Param('file_id') file_id: any) {
        return this.filesService.deleteFileById(+file_id);
    }

    // Подключаем декоратор @Put для того, чтобы в запросах работать с методом PUT.
    // Декоратор @Body для того, чтобы вычленять непосредственно тело запроса.
    // Изменяет экземпляр таблицы files по id
    // @ts-ignore
    @ApiOperation({summary: 'Изменение файла'})
    @ApiResponse({status: 200})
    @Put()
    @UseGuards(Jwt_auth_guard)
    @UsePipes(ValidationPipe)
    @UseInterceptors(FilesInterceptor('file'))
    updateFile(@Body() dto: UpdateFilesDTO, @UploadedFiles() file: any) {
        return this.filesService.updateFile(dto, file);
    }

}
