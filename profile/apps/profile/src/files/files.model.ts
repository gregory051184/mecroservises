import {Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

// интерфейс(лекало), определяющий поля модели File
interface FileCreationAttrs {
    file: any;
    essenceTable: string;
    essenceId: number;
}

// Создание модели File со столбцами
@Table({tableName: 'files'})
export class File extends Model<File, FileCreationAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique:true})
    id: number

    @ApiProperty({example: '[file1.jpeg, file2.jpeg]', description: 'Название файла изображения или файлов' +
            ' группы изображений'})
    @Column({type: DataType.ARRAY(DataType.STRING), unique: true, allowNull: false})
    file: any

    @ApiProperty({example: 'blocks', description: 'Название таблицы, к которой относятся данные файлы'})
    @Column({type: DataType.STRING, allowNull: true})
    essenceTable: string

    @ApiProperty({example: '1', description: 'Id экземпляра таблицы, к которому относятся данные файлы'})
    @Column({type: DataType.INTEGER, allowNull: true})
    essenceId: number
}