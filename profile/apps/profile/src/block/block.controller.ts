import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFiles, UseGuards,
    UseInterceptors, UsePipes, ValidationPipe
} from '@nestjs/common';
import {BlockDTO} from "./dto/create_block_dto";
import {BlockService} from "./block.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {UpdateBlockDTO} from "./dto/update_block_dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Block} from "./block.model";
import {BlockImageService} from "./block.service";
import {Jwt_auth_guard} from "../guards/jwt_auth_guard";

// ВНИМАНИЕ! Здесь два контроллера BlockController(работает с моделями Block и File) и
// BlockControllerWithImages(работает с моделями Block и FileWork)

//Этот контроллер для работы с файлами. Он сохраняет в таблицу blocks и таблицу files название файлов-изображений,
//а файлы непосредственно хранит в папке 'static' на сервере

@ApiTags('Блоки с файлами')
@Controller('blocks/files') //эндпоинт для запросов
export class BlockController {

    constructor(private blockService: BlockService) {} //прокидываем BlockService
    // для работы с обработчиками модели Block

    // Подключаем декораторы для работы визуализации API(@ApiOperation, @ApiResponse) и так для каждого метода.


    // Подключаем декоратор @Post для того, чтобы в запросах работать с методом POST
    // подключаем декораторы @UseInterceptors и @UploadedFiles для работы с файлами
    // декоратор @Body для того, чтобы вычленять непосредственно тело запроса
    // и в данном случае помещать его в параметры метода
    // данный метод создаёт экземпляры таблиц blocks и files. В данном приложении блок 'file'
    // необходим для сохранения в БД имён файлов, а на сервер самих файлов и его можно интегрировать в любой другой блок.
    @ApiOperation({summary: 'Создание блока. В создание блоков интегрирован модуль создания файлов(изображений).' +
            ' ВАЖНО! При добавлении списка файлов автоматически создаётся экземпляр таблицы files,' +
            ' который связан с таблицей blocks через поля essenceTable и essenceId. Без указания' +
            ' файлов создаётся просто блок'})
    @ApiResponse({status: 200, type: Block})
    @Post()
    @UseGuards(Jwt_auth_guard)
    @UseInterceptors(FilesInterceptor('image'))
    @UsePipes(ValidationPipe)
    create(@Body() dto: BlockDTO, @UploadedFiles() image: any) {
        return this.blockService.createBlock(dto, image);
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Метод получает все экземпляры таблицы blocks
    @ApiOperation({summary: 'Получение всех блоков'})
    @ApiResponse({status: 200, type: [Block]})
    @Get()
    @UseGuards(Jwt_auth_guard)
    getAllBlocks() {
        return this.blockService.getAllBlocks();
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // декоратор @Param получает динамическую часть url и передаёт её в
    // данный метод для получения экземпляров таблицы blocks по id группы блоков
    @ApiOperation({summary: 'Получение блоков по id группы блоков'})
    @ApiResponse({status: 200, type: [Block]})
    @Get('/:group_id')
    @UseGuards(Jwt_auth_guard)
    getBlocksByGroup(@Param('group_id') group_id: number) {
        return this.blockService.getBlocksByGroup(group_id);
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // декоратор @Param получает динамическую часть url и передаёт её в
    // данный метод для получения экземпляра таблицы blocks по id
    @ApiOperation({summary: 'Получение блока по id'})
    @ApiResponse({status: 200, type: Block})
    @Get('/:block_id')
    @UseGuards(Jwt_auth_guard)
    getBlockById(@Param('block_id') block_id: number) {
        return this.blockService.getBlockById(block_id);
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Удаляет экземпляр таблицы blocks по id
    @ApiOperation({summary: 'Удаление блока по id'})
    @ApiResponse({status: 200, type: Block})
    @Delete()
    @UseGuards(Jwt_auth_guard)
    deleteBlock(@Body() block_id: any) {
        return this.blockService.deleteBlock(block_id.id);
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Удаляет экземпляр таблицы blocks по id, только id предаётся в URL
    @ApiOperation({summary: 'Удаление блока по id'})
    @ApiResponse({status: 200, type: Block})
    @Delete('/:block_id')
    @UseGuards(Jwt_auth_guard)
    deleteBlockThroughUrlParams(@Param('block_id') block_id: any) {
        return this.blockService.deleteBlock(+block_id);
    }

    // Подключаем декоратор @Put для того, чтобы в запросах работать с методом PUT.
    // Декоратор @Body для того, чтобы вычленять непосредственно тело запроса.
    // Изменяет экземпляр таблицы blocks
    @ApiOperation({summary: 'Изменение блока'})
    @ApiResponse({status: 200})
    @Put()
    @UseGuards(Jwt_auth_guard)
    @UseInterceptors(FilesInterceptor('image'))
    @UsePipes(ValidationPipe)
    updateBlock(@Body() dto: UpdateBlockDTO, @UploadedFiles() image: any) {
        return this.blockService.updateBlock(dto, image);
    }
}

//Этот контроллер для работы с файлами. Он сохраняет в таблицу blocks название файлов-изображений,
// а таблицу images сами изображения.

@ApiTags('Блоки с изображениями')
@Controller('blocks/images')      //эндпоинт для запросов
export class BlockControllerWithImages {

    constructor(private blockImageService: BlockImageService) {} //прокидываем BlockImageService
    // для работы с обработчиками модели Block

    // Подключаем декораторы для работы визуализации API(@ApiOperation, @ApiResponse) и так для каждого метода.


    // Подключаем декоратор @Post для того, чтобы в запросах работать с методом POST
    // подключаем декораторы @UseInterceptors и @UploadedFiles для работы с файлами
    // декоратор @Body для того, чтобы вычленять непосредственно тело запроса
    // и в данном случае помещать его в параметры метода
    // данный метод создаёт экземпляры таблиц blocks и images. В данном приложении блок 'filework'
    // необходим для сохранения в БД изображений и его можно интегрировать в любой другой блок.
    @ApiOperation({summary: 'Создание блока. В создание блоков интегрирован модуль создания файлов(изображений).' +
            ' ВАЖНО! При добавлении списка файлов автоматически создаётся экземпляр таблицы images,' +
            ' который связан с таблицей blocks через поля essenceTable и essenceId. Без указания' +
            ' файлов создаётся просто блок'})
    @ApiResponse({status: 200, type: Block})
    @Post()
    @UseGuards(Jwt_auth_guard)
    @UseInterceptors(FilesInterceptor('image'))
    @UsePipes(ValidationPipe)
    create(@Body() dto: BlockDTO, @UploadedFiles() image) {
        return this.blockImageService.createBlockWithImages(dto, image)
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // Метод получает все экземпляры таблицы blocks
    @ApiOperation({summary: 'Получение всех блоков'})
    @ApiResponse({status: 200, type: [Block]})
    @Get()
    @UseGuards(Jwt_auth_guard)
    getAllBlocks() {
        return this.blockImageService.getAllBlocks();
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // декоратор @Param получает динамическую часть url и передаёт её в
    // данную функцию для получения экземпляров таблицы blocks по id группы блоков
    @ApiOperation({summary: 'Получение блоков по id группы блоков'})
    @ApiResponse({status: 200, type: [Block]})
    @Get('/:group_id')
    @UseGuards(Jwt_auth_guard)
    getBlocksByGroup(@Param('group_id') group_id: number) {
        return this.blockImageService.getBlocksByGroup(group_id);
    }

    // Подключаем декоратор @Get для того, чтобы в запросах работать с методом GET
    // декоратор @Param получает динамическую часть url и передаёт её в
    // данную функцию для получения экземпляра таблицы blocks по id
    @ApiOperation({summary: 'Получение блока по id'})
    @ApiResponse({status: 200, type: Block})
    @Get('/:block_id')
    @UseGuards(Jwt_auth_guard)
    getBlockById(@Param('block_id') block_id: number) {
        return this.blockImageService.getBlockById(block_id);
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Удаляет экземпляр таблицы blocks по id
    @ApiOperation({summary: 'Удаление блока по id'})
    @ApiResponse({status: 200, type: Block})
    @Delete()
    @UseGuards(Jwt_auth_guard)
    deleteBlock(@Body() block_id: any) {
        return this.blockImageService.deleteBlock(block_id.id);
    }

    // Подключаем декоратор @Delete для того, чтобы в запросах работать с методом DELETE.
    // Удаляет экземпляр таблицы blocks по id, только id предаётся в URL
    @ApiOperation({summary: 'Удаление блока по id'})
    @ApiResponse({status: 200, type: Block})
    @Delete('/:block_id')
    @UseGuards(Jwt_auth_guard)
    deleteBlockThroughUrlParams(@Param('block_id') block_id: any) {
        return this.blockImageService.deleteBlock(+block_id);
    }

    // Подключаем декоратор @Put для того, чтобы в запросах работать с методом PUT.
    // Декоратор @Body для того, чтобы вычленять непосредственно тело запроса.
    // Изменяет экземпляр таблицы blocks
    @ApiOperation({summary: 'Изменение блока'})
    @ApiResponse({status: 200})
    @Put()
    @UseGuards(Jwt_auth_guard)
    @UseInterceptors(FilesInterceptor('image'))
    @UsePipes(ValidationPipe)
    updateBlock(@Body() dto: UpdateBlockDTO, @UploadedFiles() image?: any) {
        return this.blockImageService.updateBlock(dto, image);
    }
}
