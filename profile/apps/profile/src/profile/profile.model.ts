import {Column, DataType, Table, Model, BelongsTo, ForeignKey} from "sequelize-typescript";
//import {User} from "../users/users.model";
import {ApiProperty} from "@nestjs/swagger";

// интерфейс(лекало), определяющий поля модели Profile
interface ProfileCreationAttrs {
    first_name: string;
    second_name: string;
    phone: string;
    age: number;
    country: string;
    user_id: number;
}

// Создание модели Profile со столбцами
@Table({tableName: 'profiles'})
export class Profile extends Model<Profile, ProfileCreationAttrs>{

    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique:true})
    id: number;

    @ApiProperty({example: 'Иван', description: 'Имя'})
    @Column({type: DataType.STRING, allowNull: false})
    first_name: string;

    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    @Column({type: DataType.STRING, allowNull: false})
    second_name: string;

    @ApiProperty({example: '8927000000', description: 'Номер телефона'})
    @Column({type: DataType.STRING, allowNull: false, unique: true})
    phone: string;

    @ApiProperty({example: '18', description: 'Возраст'})
    @Column({type: DataType.INTEGER, allowNull: true})
    age: number;

    @ApiProperty({example: 'Россия', description: 'Страна'})
    @Column({type: DataType.STRING, allowNull: true})
    country: string;

    //@ApiProperty({example: '1', description: 'Внешний ключ на таблицу users'})
    //@ForeignKey(() => User)
    @Column({type: DataType.INTEGER, onDelete: 'cascade'})
    user_id: number

    //@BelongsTo(() => User)
    //user: User
}

