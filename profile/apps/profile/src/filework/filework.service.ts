import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {FileWork} from "./filework.model";
import {FileWorkDTO} from "./dto/create_file_work_dto";
import {Sequelize} from "sequelize";
import {UpdateFileWorkDTO} from "./dto/update_file_work_dto";

// Создаём класс для работы с моделью FileWork
@Injectable()
export class FileWorkService {

    constructor(@InjectModel(FileWork) private fileWorkRepository: typeof FileWork) {
    }

    //Метод для создания экземпляра модели FileWork (занесение в БД файлов) записывает в БД именно файл
    async createFileWork(images: any, dto?: FileWorkDTO) {
        const list = images.map(img => img.originalname.split('.')[0]);
        const title_name = list.join(''); // создаём строку из конкатенированных имён файлов
        if (dto.essenceTable && dto.essenceId) { // если в запросе передано название таблицы и id экземпляра этой таблицы,
            // к которому будет относиться этот файл(файлы)
            const existing_instance = await this.fileWorkRepository.findOne(
                {where: {essenceTable: dto.essenceTable, essenceId: dto.essenceId}});
            if (!existing_instance) { // проверяем наличие такой записи в БД
                // подключаемся к БД
                const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@` +
                    `${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`, {
                    logging: false
                });
                // получаем название всех таблиц БД
                await sequelize.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`)
                    .then(data => data.map(table => table.toString()))
                    .then(data => {
                            // проверяем, что таблица из запроса существует в БД
                            if (data.includes(dto.essenceTable)) {
                                sequelize.query(`SELECT id FROM ${dto.essenceTable} WHERE id=${dto.essenceId}`)
                                    .then(data => {
                                        // проверяем, что экземпляр с id из запроса есть в этой таблице
                                        if (+data[0][0]['id'] && +data[0][0]['id'] === +dto.essenceId) {
                                            const file = this.fileWorkRepository.create({
                                                ...dto, image: images, title: title_name});
                                            return file;
                                        }
                                    })
                            }

                        }
                    )
                throw new HttpException('Неверный запрос', HttpStatus.BAD_REQUEST)
            }
        }
        if (!dto.essenceTable || !dto.essenceId) { // если не указано наименование таблицы и id экземпляра
            const
                image = await this.fileWorkRepository.create({...dto, image: images, title: title_name});
            return image;
        }
    }

    //Метод для получения экземпляров модели FileWork, которые были созданы больше 1 часа
    async getOutOfTimeImages() {
        const images = await this.fileWorkRepository.findAll();
        const date = new Date;
        const images_list = images.filter(image => (image.createdAt.getTime() + 3600000) < date.getTime());
        return images_list;
    }

    //Метод для получения экземпляров модели FileWork, которых essenceTable=null или essenceId=null
    async getUnusedImages() {
        const images = await this.fileWorkRepository.findAll();
        const unused_images_list = images.filter(image => image.essenceTable === null || image.essenceId === null);
        return unused_images_list;
    }

    //Метод для получения экземпляров модели FileWork, у которых essenceTable=null или essenceId=null
    // или которые были созданы больше 1 часа
    async getAllTrashImages() {
        const images = await this.fileWorkRepository.findAll();
        const date = new Date;
        const trash_images_list = images.filter(image => (image.createdAt.getTime() + 3600000) < date.getTime() ||
            image.essenceTable === null || image.essenceId === null);
        return trash_images_list;
    }

    //Метод для удаления экземпляров модели FileWork, у которых essenceTable=null или essenceId=null
    // или которые были созданы больше 1 часа
    async deleteAllTrashImages() {
        const images = await this.fileWorkRepository.findAll()
        const date = new Date
        const trash_images_list = images.filter(image => (image.createdAt.getTime() + 3600000) < date.getTime() ||
            image.essenceTable === null || image.essenceId === null)
        trash_images_list.forEach(image => {
            this.fileWorkRepository.destroy({where: {id: image.id}})
        })
        return trash_images_list;
    }

    //Метод для удаления экземпляра модели FileWork по id
    async deleteImageById(image_id: number) {
        const deleted_image = await this.fileWorkRepository.destroy({where: {id: image_id}});
        return deleted_image;
    }

    //Метод для изменения экземпляров модели FileWork по id
    async updateFileWork(dto: UpdateFileWorkDTO, image?: any) {
        if (image) { // проверяем передаются ли в запросе файлы
            const updated_file_work = await this.fileWorkRepository.update({title: dto.title, image: image,
                essenceId: dto.essenceId, essenceTable: dto.essenceTable}, {where: {id: dto.id}});
            return updated_file_work;
        }
        const updated_file_work = await this.fileWorkRepository.update({title: dto.title,
            essenceId: dto.essenceId, essenceTable: dto.essenceTable}, {where: {id: dto.id}});
        return updated_file_work;
    }

    //Метод для получения экземпляра модели FileWork по essenceTable и essenceId
    async getImageByEssenceIdAndEssenceTable(essenceId: number, essenceTable: string) {
        const image = await this.fileWorkRepository.findOne({where: {essenceId: essenceId,
                essenceTable: essenceTable}});
        return image;
    }

    //Метод для удаления экземпляра модели FileWork по essenceTable и essenceId
    async deleteImageByEssenceIdAndEssenceTable(essenceId: number, essenceTable: string) {
        const image = await this.fileWorkRepository.destroy({where: {essenceId: essenceId,
                essenceTable: essenceTable}});
        return image;
    }

    //Метод для получения экземпляров модели FileWork по id
    async getFileById(image_id: number) {
        const image = await this.fileWorkRepository.findByPk(image_id);
        return image;
    }
}
