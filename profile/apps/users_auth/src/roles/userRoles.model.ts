import {Column, DataType, Table, Model, ForeignKey} from "sequelize-typescript";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {ApiProperty} from "@nestjs/swagger";



@Table({tableName: 'user_roles', createdAt: false, updatedAt: false})
export class UserRoles extends Model<UserRoles>{

    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique:true})
    id: number;

    @ApiProperty({example: '1', description: 'Внешний ключ к таблице roles'})
    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER})
    roleId: number;

    @ApiProperty({example: '1', description: 'Внешний ключ к таблице users'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;
}