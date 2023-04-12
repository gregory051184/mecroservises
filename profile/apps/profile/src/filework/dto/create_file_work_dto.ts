import {ApiProperty} from "@nestjs/swagger";

export class FileWorkDTO {

    @ApiProperty({example: 'blocks', description: 'Название таблицы, к которой относятся данные изображения'})
    readonly essenceTable?: string;

    @ApiProperty({example: '1', description: 'Id экземпляра таблицы, к которому относятся данные изображения'})
    readonly essenceId?: number;
}