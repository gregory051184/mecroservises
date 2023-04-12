import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty,IsString} from "class-validator";

export class UpdateUserDTO {

    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    @IsNotEmpty({message: 'id не должен быть пустым'})
    readonly id: number;

    @IsEmail()
    @IsNotEmpty({message: 'Email не должен быть пустым'})
    @ApiProperty({example: 'bill@gmail.com', description: 'Почтовый адрес'})
    readonly email: string;

    @ApiProperty({example: 't213fggf', description: 'Пароль'})
    @IsString({message: 'Пароль должен быть строкой'})
    @IsNotEmpty({message: 'Пароль не должен быть пустым'})
    readonly password: string;
}