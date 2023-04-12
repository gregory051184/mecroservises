import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Block} from "../block/block.model";

// интерфейс(лекало), определяющий поля модели BlockGroup
interface BlockGroupCreatingAttrs {
    value: string;
    description: string;
}

// Создание модели BlockGroup со столбцами
@Table({tableName: 'blockGroups'})
export class BlockGroup extends Model<BlockGroup, BlockGroupCreatingAttrs> {

    @ApiProperty({example: 1, description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique: true})
    id: number

    @ApiProperty({example: 'main', description: 'Название группы блоков'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    value: string

    @ApiProperty({example: 'Главная группа', description: 'Группа блоков для...'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string

    @HasMany(() => Block)
    block: Block
}