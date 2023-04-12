import {Column, DataType, Table, Model, BelongsToMany} from "sequelize-typescript";
import {User} from "../users/users.model";
import {UserRoles} from "./userRoles.model";
import {ApiProperty} from "@nestjs/swagger";

// интерфейс(лекало), определяющий поля модели Role
interface RoleCreationAttrs {
    value: string;
    description: string;
}

// Создание модели Role со столбцами
@Table({tableName: 'roles'})
export class Role extends Model<Role, RoleCreationAttrs>{

    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique:true})
    id: number;

    @ApiProperty({example: 'USER', description: 'Название роли'})
    @Column({type: DataType.STRING, unique:true, allowNull: false})
    value: string;

    @ApiProperty({example: 'Пользователь', description: 'Описание роли'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[]
}