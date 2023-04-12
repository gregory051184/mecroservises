import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class RoleDTO {

    @IsString({message: 'Значение роли должно быть строкой'})
    @IsNotEmpty({message: 'Значение роли не должно быть пустым'})
    @ApiProperty({example: 'USER', description: 'Название роли'})
    readonly value: string;

    @IsString({message: 'Описание роли должно быть строкой'})
    @IsNotEmpty({message: 'Описание роли не должно быть пустым'})
    @ApiProperty({example: 'Пользователь', description: 'Описание роли'})
    readonly description: string;
}