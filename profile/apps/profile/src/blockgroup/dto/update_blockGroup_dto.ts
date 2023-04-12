import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UpdateBlockGroupDTO {

    @IsNotEmpty({message: 'id не должен быть пустым'})
    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    readonly id: number;

    @IsString({message: 'Название группы блоков должно быть строкой'})
    @IsNotEmpty({message: 'Название группы блоков не должно быть пустым'})
    @ApiProperty({example: 'main', description: 'Название группы блоков'})
    readonly value: string;

    @IsString({message: 'Описание группы блоков должно быть строкой'})
    @IsNotEmpty({message: 'Описание группы блоков не должно быть пустым'})
    @ApiProperty({example: 'Главная группа', description: 'Группа блоков для...'})
    readonly description: string;
}