import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UpdateFileWorkDTO {

    @IsNotEmpty({message: 'id не должен быть пустым'})
    @ApiProperty({example: 1, description: 'Уникальный ключ'})
    readonly id: number;

    @IsString({message: 'Название файла должно быть строкой'})
    @ApiProperty({example: 'image1', description: 'Название изображения или группы изображений'})
    readonly title?: string;

    //@ApiProperty({example: '[image1.jpeg, image2.jpeg]', description: 'Файл изображения или файлы' +
    //        ' группы изображений'})
    //readonly image?: any;

    @ApiProperty({example: 'blocks', description: 'Название таблицы, к которой относятся данные изображения'})
    readonly essenceTable?: string;

    @ApiProperty({example: '1', description: 'Id экземпляра таблицы, к которому относятся данные изображения'})
    readonly essenceId?: number;
}