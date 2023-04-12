import {ApiProperty} from "@nestjs/swagger";


export class FilesDTO {

    @ApiProperty({example: 'blocks', description: 'Название таблицы, к которой относятся данные файлы'})
    readonly essenceTable?: string;

    @ApiProperty({example: '1', description: 'Id экземпляра таблицы, к которому относятся данные файлы'})
    readonly essenceId?: number;
}

