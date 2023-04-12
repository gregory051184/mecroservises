import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";

export class UpdateProfileDTO {

    @IsNotEmpty({message: 'id не должен быть пустым'})
    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    readonly id: number;

    @IsNotEmpty({message: 'user_id не должен быть пустым'})
    @ApiProperty({example: '1', description: 'Внешний ключ на таблицу users'})
    readonly user_id: number;

    @IsString({message: 'Имя должно быть строкой'})
    @ApiProperty({example: 'Иван', description: 'Имя'})
    readonly first_name?: string;

    @IsString({message: 'Фамилия должна быть строкой'})
    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    readonly second_name?: string;

    @Length(11, 12)
    @IsString({message: 'Номер телефона должен быть строкой'})
    @ApiProperty({example: '89270000000', description: 'Номер телефона'})
    readonly phone?: string;

    @ApiProperty({example: '18', description: 'Возраст'})
    readonly age?: number;

    @IsString({message: 'Название страны должно быть строкой'})
    @ApiProperty({example: 'Россия', description: 'Страна'})
    readonly country?: string;
}