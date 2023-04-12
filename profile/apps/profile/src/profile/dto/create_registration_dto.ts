import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class RegistrationDTO {

    @IsEmail()
    @IsNotEmpty({message: 'Email не должен быть пустым'})
    @ApiProperty({example: 'bill@gmail.com', description: 'Почтовый адрес'})
    readonly email: string;

    @IsString({message: 'Пароль должен быть строкой'})
    @IsNotEmpty({message: 'Пароль не должен быть пустым'})
    @ApiProperty({example: 't213fggf', description: 'Пароль'})
    readonly password: string;

    @IsString({message: 'Имя должно быть строкой'})
    @IsNotEmpty({message: 'Имя не должно быть пустым'})
    @ApiProperty({example: 'Иван', description: 'Имя'})
    readonly first_name: string;

    @IsString({message: 'Фамилия должна быть строкой'})
    @IsNotEmpty({message: 'Фамилия не должна быть пустым'})
    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    readonly second_name: string;

    @Length(11, 12)
    @IsString({message: 'Номер телефона должен быть строкой'})
    @IsNotEmpty({message: 'Номер телефона не должен быть пустым'})
    @ApiProperty({example: '8927000000', description: 'Номер телефона'})
    readonly phone: string;

    @ApiProperty({example: '18', description: 'Возраст'})
    readonly age: number;

    @IsString({message: 'Название страны должно быть строкой'})
    @ApiProperty({example: 'Россия', description: 'Страна'})
    readonly country: string;
}