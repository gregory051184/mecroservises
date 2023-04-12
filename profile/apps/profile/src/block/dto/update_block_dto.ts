import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class UpdateBlockDTO {

    //@IsNotEmpty({message: 'id не должен быть пустым'})
    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    readonly id: number;

    //@IsString({message: 'Slug блока должен быть строкой'})
    @ApiProperty({example: "промоблок1", description: 'Уникальная строка для поиска блока'})
    readonly slug?: string;

    //@IsString({message: 'Название блока должно быть строкой'})
    @ApiProperty({example: "ПромоБлок", description: 'Название блока'})
    readonly title?: string;

    //@ApiProperty({example: "[file.jpeg, file2.jpeg]", description: 'Массив из нескольких файлов'})
    //readonly image?: any;

    //@IsString({message: 'Текст блока должен быть строкой'})
    @ApiProperty({example: "Какой-либо текст", description: 'Содержание блока'})
    readonly text?: string;

    @ApiProperty({example: "1", description: 'Id blockGroups'})
    readonly group_id?: number;
}