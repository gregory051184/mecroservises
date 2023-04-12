import {Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

// интерфейс(лекало), определяющий поля модели FileWork
interface FileWorkCreationAttrs {
    title: string;
    image: any;
    essenceTable: string;
    essenceId: number;
}

// Создание модели FileWork со столбцами
@Table({tableName: 'images'})
export class FileWork extends Model<FileWork, FileWorkCreationAttrs> {

    @ApiProperty({example: 1, description: 'Уникальный ключ'})
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique:true})
    id: number

    @ApiProperty({example: 'image1', description: 'Название изображения или группы изображений'})
    @Column({type: DataType.STRING, unique:true})
    title: string

    @ApiProperty({example: '[image1.jpeg, image2.jpeg]', description: 'Файл изображения или файлы' +
            ' группы изображений'})
    @Column({type: DataType.ARRAY(DataType.BLOB)})
    image: any

    @ApiProperty({example: 'blocks', description: 'Название таблицы, к которой относятся данные изображения'})
    @Column({type: DataType.STRING, allowNull: true})
    essenceTable: string

    @ApiProperty({example: '1', description: 'Id экземпляра таблицы, к которому относятся данные изображения'})
    @Column({type: DataType.INTEGER, allowNull: true})
    essenceId: number
}