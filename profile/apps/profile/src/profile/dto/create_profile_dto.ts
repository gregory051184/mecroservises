import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";

export class ProfileDTO {

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

    @Length(1, 3)
    @ApiProperty({example: '18', description: 'Возраст'})
    readonly age: number;

    @IsString({message: 'Название страны должно быть строкой'})
    @ApiProperty({example: 'Россия', description: 'Страна'})
    readonly country: string;

    @IsNotEmpty({message: 'id пользователя не должен быть пустым'})
    @ApiProperty({example: '1', description: 'id пользователя'})
    readonly user_id: number;
}