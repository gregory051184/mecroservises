import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";


export class AddRoleDTO {

    @IsString({message: 'Значение роли должно быть строкой'})
    @IsNotEmpty({message: 'Значение роли не должно быть пустым'})
    @ApiProperty({example: 'ADMIN', description: 'Название роли пользователя'})
    readonly value: string;

    @IsNotEmpty({message: 'id пользователя не должен быть пустым'})
    @ApiProperty({example: '1', description: 'id пользователя, которому эта роль будет присвоена'})
    readonly user_id: number;
}