import {Column, DataType, Table, Model, BelongsToMany, HasOne} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/userRoles.model";
//import {Profile} from "../profile/profile.model";

// интерфейс(лекало), определяющий поля модели User
interface UserCreationAttrs {
    email: string;
    password: string;
}

// Создание модели User со столбцами
@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs>{

    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique:true})
    id: number;

    @ApiProperty({example: 'bill@gmail.com', description: 'Почтовый адрес'})
    @Column({type: DataType.STRING, unique:true, allowNull: false})
    email: string;

    @ApiProperty({example: 't213fggf', description: 'Пароль'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[]

    //@HasOne(() => Profile)
    //profile: Profile
}