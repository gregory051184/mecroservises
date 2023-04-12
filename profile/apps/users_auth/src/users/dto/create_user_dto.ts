import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class UserDTO {
    @ApiProperty({example: 'bill@gmail.com', description: 'Почтовый адрес'})
    //@IsEmail()
    //@IsNotEmpty({message: 'Email не должен быть пустым'})
    readonly email: string;

    @ApiProperty({example: '2321', description: 'Пароль'})
    //@IsString({message: 'Пароль должен быть строкой'})
    //@IsNotEmpty({message: 'Пароль не должен быть пустым'})
    readonly password: string;
}