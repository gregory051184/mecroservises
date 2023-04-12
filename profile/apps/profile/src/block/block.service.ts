import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Block} from "./block.model";
import {BlockDTO} from "./dto/create_block_dto";
import {FilesService} from "../files/files.service";
import {UpdateBlockDTO} from "./dto/update_block_dto";
import {FileWorkService} from "../filework/filework.service";


// Создаём класс для работы с моделью Block и моделью File
// в этом сервисе в экземпляр модели Block записываются имена файлов, которые обрабатывает
// модель File, сохраняя уже в своих экземплярах имена файлов и сохраняя на сервере сами файлы
@Injectable()
export class BlockService {

    constructor(@InjectModel(Block) private blockRepository: typeof Block,
                private filesService: FilesService) {
    }

    // Метод для создания экземпляра модели Block и экземпляра модели File
    // (занесение имён файлов в БД, а самих файлов на сервер)
    async createBlock(dto: BlockDTO, image?: any) {
        try {
            const table_name = this.blockRepository.getTableName().toString()
            if (image.length > 0) { // проверяем есть ли файлы
                // создаём экземпляр модели File без ссылки на конкретный экземпляр модели Block
                const new_file = await this.filesService.createFile(image, {essenceTable: table_name, essenceId: null});
                const title_name = new_file.file.join('');
                // создаём экземпляр модели Block
                const block = await this.blockRepository.create({
                    ...dto, title: title_name,
                    slug: (dto.text.replace(' ', '') + '-' + new_file.file + '-' + dto.group_id)
                        .replace(' ', ''), image: new_file.file
                });
                // забираем id из созданного экземпляра модели Block и изменяем созданный экземпляр модели File,
                // передавая этот id в essenceId
                await this.filesService.updateFile({
                    id: new_file.id, //file: image,
                    essenceTable: new_file.essenceTable, essenceId: block.id
                }, image)
                const final_file = await this.filesService.getFileByEssenceIdAndEssenceTable(block.id, table_name)
                return {block: block, file: final_file};
            } else {
                // если нет файлов, то просто создаём экземпляра модели Block
                const block = await this.blockRepository.create({
                    ...dto,
                    slug: dto.text.replace(' ', '') + '-' + dto.group_id,
                    title: 'title-' + dto.text
                });
                return block;
            }
        } catch (err) {
            throw new HttpException(`Названия файлов должны быть уникальными ${err}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Метод для получения всех экземпляров модели Block
    // и связанных с этими экземплярами essenceTable и essenceId экземпляров модели File
    async getAllBlocks() {
        const table_name = this.blockRepository.getTableName().toString();
        const blocks = await this.blockRepository.findAll({include: {all: true}});
        const new_blocks = blocks.map(block => {
            const file = this.filesService.getFileByEssenceIdAndEssenceTable(block.id, table_name);
            if (file) {
                return {block: block, file: {essenceTable: table_name, essenceId: block.id}};
            }
            return {block: block, file: null};
        })
        return new_blocks;
    }

    //Метод для получения блоков по группам блоков
    async getBlocksByGroup(group_id: number) {
        const blocks = this.blockRepository.findAll({where: {group_id: group_id}, include: {all: true}});
        return blocks;
    }

    //Метод для получения блоков по id
    async getBlockById(block_id: number) {
        const block = await this.blockRepository.findOne({where: {id: block_id}, include: {all: true}});
        return block;
    }

    //Метод для изменения блоков по id
    async updateBlock(dto: UpdateBlockDTO, image?: any) {
        const existing_block = await this.blockRepository.findOne({where: {id: dto.id}})
        const existing_file = await this.filesService.getFileByEssenceIdAndEssenceTable(existing_block.id, 'blocks')
        // если есть связанный с блоком экземпляр модели File и есть в запросе файлы,
        // то изменяем в экземпляре модели File имена файлов на новые и в блоке тоже меняем имена файлов,
        // также могут измениться и другие строки в блоке
        if (existing_file && image) {
            await this.filesService.updateFile({
                id: existing_file.id,
                essenceTable: existing_file.essenceTable, essenceId: existing_file.essenceId
            }, image)
            const new_file = await this.filesService.getFileById(existing_file.id)
            const block = await this.blockRepository.update({
                slug: dto.slug, title: dto.title, image: new_file.file,
                text: dto.text, group_id: dto.group_id
            }, {where: {id: dto.id}})
            return {block: block, file: new_file}
            // если нет связанного с блоком экземпляр модели File, но есть в запросе файлы,
            // то создаём экземпляр модели File, а в блоке меняем имена файлов на новые,
            // также могут измениться и другие строки в блоке
        } else if (!existing_file && image) {
            const new_file = await this.filesService.createFile(image)
            const block = await this.blockRepository.update({
                slug: dto.slug, title: dto.title, image: new_file.file,
                text: dto.text, group_id: dto.group_id
            }, {where: {id: dto.id}})
            return {block: block, file: new_file}
        }
        // если нет ни связанного экземпляр модели File, ни файлов в запросе,
        // то изменяются любые строки блока, кроме строки с файлами(image)
        const block = await this.blockRepository.update({
            slug: dto.slug, title: dto.title, text: dto.text, group_id: dto.group_id
        }, {where: {id: dto.id}})
        return block;
    }

    // Метод для удаления блоков по id. Вместе с блоком удаляется
    // экземпляр модели File по essenceTable и essenceId
    async deleteBlock(block_id: number) {
        const block = await this.blockRepository.destroy({where: {id: block_id}});
        const file = await this.filesService.deleteFileByEssenceIdAndEssenceTable(block_id,
            this.blockRepository.getTableName().toString());
        return {deleted_block_id: block, deleted_file_essenceId: file};
    }
}

// Создаём класс для работы с моделью Block и моделью FileWork
// в этом сервисе в экземпляр модели Block записываются имена файлов, которые обрабатывает
// модель FileWork, сохраняя уже в своих экземплярах сами файлы
@Injectable()
export class BlockImageService {
    constructor(@InjectModel(Block) private blockRepository: typeof Block,
                private fileWorkService: FileWorkService) {
    }

    // Метод для создания экземпляра модели Block и экземпляра модели FileWork
    // (занесение имён файлов в таблицу blocks, а самих файлов в таблицу images)
    async createBlockWithImages(dto: BlockDTO, image?: any) {
        try {
            const table_name = this.blockRepository.getTableName().toString()
            if (image.length > 0) {// проверяем есть ли файлы
                // создаём экземпляр модели FileWork без ссылки на конкретный экземпляр модели Block
                const new_image = await this.fileWorkService.createFileWork(image,{
                    essenceTable: table_name,
                    essenceId: null
                });
                const list = image.map(img => img.originalname.split('.')[0]);
                const title_name = list.join('');
                // создаём экземпляр модели Block
                const block = await this.blockRepository.create({
                    ...dto, title: title_name,
                    slug: (dto.text.replace(' ', '') + '-' + title_name + '-' + dto.group_id)
                        .replace(' ', ''), image: list
                });
                // забираем id из созданного экземпляра модели Block и изменяем созданный экземпляр модели FileWork,
                // передавая этот id в essenceId
                await this.fileWorkService.updateFileWork({
                    id: new_image.id, essenceTable: new_image.essenceTable, essenceId: block.id
                }, image)
                const final_image = await this.fileWorkService.getImageByEssenceIdAndEssenceTable(block.id, table_name)
                return {block: block, file: final_image};
            } else {
                // если нет файлов, то просто создаём экземпляра модели Block
                const block = await this.blockRepository.create({
                    ...dto,
                    slug: dto.text.replace(' ', '') + '-' + dto.group_id,
                    title: 'title-' + dto.text
                });
                return block;
            }
        } catch (err) {
            throw new HttpException('Названия файлов должны быть уникальными', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Метод для получения всех экземпляров модели Block
    // и связанных с этими экземплярами essenceTable и essenceId экземпляров модели FileWork
    async getAllBlocks() {
        const table_name = this.blockRepository.getTableName().toString();
        const blocks = await this.blockRepository.findAll({include: {all: true}});
        const new_blocks = blocks.map(block => {
            const image = this.fileWorkService.getImageByEssenceIdAndEssenceTable(block.id, table_name);
            if (image) {
                return {block: block, image: {essenceTable: table_name, essenceId: block.id}};
            }
            return {block: block, image: null};
        })
        return new_blocks;
    }

    //Метод для получения блоков по группам блоков
    async getBlocksByGroup(group_id: number) {
        const blocks = this.blockRepository.findAll({where: {group_id: group_id}, include: {all: true}});
        return blocks;
    }

    //Метод для получения блоков по id
    async getBlockById(block_id: number) {
        const block = await this.blockRepository.findOne({where: {id: block_id}, include: {all: true}});
        return block;
    }

    //Метод для изменения блоков по id
    async updateBlock(dto: UpdateBlockDTO, image?: any) {
        const titles_list = [];
        const existing_block = await this.blockRepository.findOne({where: {id: dto.id}})
        const existing_file = await this.fileWorkService.getImageByEssenceIdAndEssenceTable(existing_block.id, 'blocks')
        // если есть связанный с блоком экземпляр модели FileWork и есть в запросе файлы,
        // то изменяем в экземпляре модели FileWork файлы на новые, а в блоке меняем имена файлов,
        // также могут измениться и другие строки в блоке
        if (existing_file && image) {
            await this.fileWorkService.updateFileWork({
                id: existing_file.id, title: existing_file.title,
                essenceTable: existing_file.essenceTable, essenceId: existing_file.essenceId
            }, image)
            const new_file = await this.fileWorkService.getFileById(existing_file.id)
            for(let i = 0; i < new_file.image.length; i++) {
                const file = new_file.image[i]
                titles_list.push(file.originalname)
            }
            const block = await this.blockRepository.update({
                slug: dto.slug, title: dto.title, image: titles_list,
                text: dto.text, group_id: dto.group_id
            }, {where: {id: dto.id}})
            return {block: block, file: new_file}
        }
            // если нет связанного с блоком экземпляр модели FileWork, но есть в запросе файлы,
            // то создаём экземпляр модели FileWork, а в блоке меняем имена файлов на новые,
        // также могут измениться и другие строки в блоке
        else if (!existing_file && image) {
            const new_file = await this.fileWorkService.createFileWork(image)
            for(let i = 0; i < new_file.image.length; i++) {
                const file = new_file.image[i]
                titles_list.push(file.originalname)
            }
            const block = await this.blockRepository.update({
                slug: dto.slug, title: dto.title, image: titles_list,
                text: dto.text, group_id: dto.group_id
            }, {where: {id: dto.id}})
            return {block: block, file: new_file}
        }
        // если нет ни связанного экземпляр модели FileWork, ни файлов в запросе,
        // то изменяются любые строки блока, кроме строки с файлами(image)
        const block = await this.blockRepository.update({
            slug: dto.slug, title: dto.title, text: dto.text, group_id: dto.group_id
        }, {where: {id: dto.id}})
        return block;
    }

    // Метод для удаления блоков по id. Вместе с блоком удаляется
    // экземпляр модели FileWork по essenceTable и essenceId
    async deleteBlock(block_id: number) {
        const block = await this.blockRepository.destroy({where: {id: block_id}});
        const file = await this.fileWorkService.deleteImageByEssenceIdAndEssenceTable(block_id,
            this.blockRepository.getTableName().toString());
        return {deleted_block_id: block, deleted_file_essenceId: file};
    }

}
