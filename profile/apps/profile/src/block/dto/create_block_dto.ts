import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class BlockDTO {

    @IsString({message: 'Текст блока должен быть строкой'})
    @IsNotEmpty({message: 'Текст блока блока не должен быть пустым'})
    @ApiProperty({example: "Какой-либо текст", description: 'Содержание блока'})
    readonly text: string;

    @IsNotEmpty({message: 'id группы блоков не должно быть пустым'})
    @ApiProperty({example: "1", description: 'Id blockGroups'})
    readonly group_id: number;
}