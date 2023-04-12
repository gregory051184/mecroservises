import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {BlockGroup} from "../blockgroup/blockgroup.model";

// интерфейс(лекало), определяющий поля модели Block
interface BlockCreatingAttrs {
    slug: string;
    title: string;
    image?: any;
    text: string;
    group_id: number;
}

// Создание модели Block со столбцами
@Table({tableName: 'blocks'})
export class Block extends Model<Block, BlockCreatingAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique:true})
    id: number

    @ApiProperty({example: "промоблок1", description: 'Уникальная строка для поиска блока'})
    @Column({type: DataType.STRING, unique:true, allowNull: false})
    slug: string

    @ApiProperty({example: "ПромоБлок", description: 'Название блока'})
    @Column({type: DataType.STRING, allowNull: false})
    title: string

    @ApiProperty({example: "[file.jpeg, file2.jpeg]", description: 'Массив из нескольких файлов'})
    @Column({type: DataType.ARRAY(DataType.STRING), allowNull: true})
    image: any

    @ApiProperty({example: "Кокой-либо текст", description: 'Содержание блока'})
    @Column({type: DataType.STRING, allowNull: false})
    text: string

    @ApiProperty({example: "1", description: 'Внешний ключ на таблицу blockGroups'})
    @ForeignKey(() => BlockGroup)
    @Column({type: DataType.INTEGER})
    group_id: number

    @BelongsTo(() => BlockGroup)
    blockGroup: BlockGroup
}