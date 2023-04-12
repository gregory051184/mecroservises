import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class UpdateFilesDTO {

    @IsNotEmpty({message: 'id не должен быть пустым'})
    @ApiProperty({example: '1', description: 'Уникальный ключ'})
    readonly id: number;

    //@ApiProperty({example: '[file1.jpeg, file2.jpeg]', description: 'Название файла изображения или файлов' +
    //        ' группы изображений'})
    //readonly file?: any;

    @IsString({message: 'Название таблицы должно быть строкой'})
    @ApiProperty({example: 'blocks', description: 'Название таблицы, к которой относятся данные файлы'})
    readonly essenceTable?: string;

    @ApiProperty({example: '1', description: 'Id экземпляра таблицы, к которому относятся данные файлы'})
    readonly essenceId?: number;
}