import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as fs from "fs";
import * as path from "path";
import {FilesDTO} from "./dto/create_file_dto";
import {InjectModel} from "@nestjs/sequelize";
import {File} from "./files.model";
import {Sequelize} from "sequelize";
import {UpdateFilesDTO} from "./dto/update_file_dto";


// Создаём класс для работы с моделью File
@Injectable()
export class FilesService {

    constructor(@InjectModel(File) private fileRepository: typeof File) {
    }

    //Метод для создания экземпляра модели File (занесение в БД файлов) записывает в БД имена файлов,
    // а на сервере сами файлы
    async createFile(files: any, dto?: FilesDTO) {
        const list = files.map(file => file.originalname.split('.')[0]);
        const filePath = path.resolve(__dirname, '..', 'static'); // создаём путь к папке, где будут храниться файлы
        console.log(filePath)
        if (!fs.existsSync(filePath)) {
            fs.mkdir(filePath, {recursive: true}, (err) => { // если такой папки нет, то она рекурсивно создаётся
                if (err) console.log('Не вышло создать папку')
            })
        }
        files.forEach(file => {
            const fileName = file.originalname;
            fs.writeFile(path.join(filePath, fileName), file.buffer, (err) => {// записываем файлы на сервер
                if (err) console.log('Не удалось создать файл')
            })
        })
        if (dto.essenceTable && dto.essenceId) { // если в запросе передано название таблицы и id экземпляра этой таблицы,
            // к которому будет относиться этот файл(файлы)
            const existing_instance = await this.fileRepository.findOne(
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
                                    if (+data[0][0]['id'] === +dto.essenceId) {
                                        const new_file = this.fileRepository.create({...dto, file: list});
                                        return new_file;
                                    }
                                })
                        }
                    })
                throw new HttpException('Неверный запрос', HttpStatus.BAD_REQUEST)
            }
        }
        if (!dto.essenceTable || !dto.essenceId) { // если не указано наименование таблицы и id экземпляра
            const files_list = []
            // создаём список имён файлов
            for(let i = 0; i < files.length; i++) {
                const file = files[i]
                files_list.push(file.originalname)
            }
            const new_file = this.fileRepository.create({...dto, file: files_list});
            return new_file;
        }
    }

    //Метод для получения экземпляра модели File по essenceTable и essenceId
    async getFileByEssenceIdAndEssenceTable(essenceId: number, essenceTable: string) {
        const file = await this.fileRepository.findOne({where: {essenceId: essenceId,
                essenceTable: essenceTable}});
        return file;
    }

    //Метод для получения всех экземпляров модели File
    async getAllFiles() {
        const files = await this.fileRepository.findAll({include: {all: true}});
        return files;
    }

    //Метод для получения экземпляра модели File по id
    async getFileById(file_id: number) {
        const file = await this.fileRepository.findByPk(file_id);
        return file;
    }

    //Метод для получения экземпляров модели File, которые были созданы больше 1 часа
    async getOutOfTimeFiles() {
        const files = await this.fileRepository.findAll();
        const date = new Date;
        const files_list = files.filter(file => (file.createdAt.getTime() + 3600000) < date.getTime());
        return files_list;
    }

    //Метод для получения экземпляров модели File, которых essenceTable=null или essenceId=null
    async getUnusedFiles() {
        const files = await this.fileRepository.findAll();
        const unused_files_list = files.filter(file => file.essenceTable === null || file.essenceId === null);
        return unused_files_list;
    }

    //Метод для получения экземпляров модели File, у которых essenceTable=null или essenceId=null
    // или которые были созданы больше 1 часа
    async getAllTrashFiles() {
        const files = await this.fileRepository.findAll();
        const date = new Date;
        const trash_files_list = files.filter(file => ((file.createdAt.getTime() + 3600000) < date.getTime()) ||
            file.essenceTable === null || file.essenceId === null);
        return trash_files_list;
    }

    //Метод для изменения экземпляров модели File по id
    async updateFile(dto: UpdateFilesDTO, file?: any) {
        if (file) { // проверяем передаются ли в запросе файлы
            const files_list = []
            // получаем путь к папке для хранения файлов на сервере или создаём её
            const filePath = path.resolve(__dirname, '..', 'static');
            if (!fs.existsSync(filePath)) {
                fs.mkdir(filePath, {recursive: true}, (err) => { // если такой папки нет, то она
                    // рекурсивно создаётся
                    if (err) console.log('Не вышло создать папку')
                })
            }
            // записываем файлы на сервер
            file.forEach(file => {
                const fileName = file.originalname;
                fs.writeFile(path.join(filePath, fileName), file.buffer, (err) => {// записываем
                    // файлы на сервер
                    if (err) console.log('Не удалось создать файл')
                })
            })
            for(let i = 0; i < file.length; i++) {
                const file_obj = file[i]
                files_list.push(file_obj.originalname)
            }
            const updated_file_with_files = await this.fileRepository.update({file:files_list,
                essenceTable:dto.essenceTable, essenceId: dto.essenceId}, {where: {id: dto.id}})
            return updated_file_with_files;
        }
        const updated_file = await this.fileRepository.update({
            essenceTable:dto.essenceTable, essenceId: dto.essenceId}, {where: {id: dto.id}})
        return updated_file;
    }

    //Метод для удаления экземпляра модели File по essenceTable и essenceId
    async deleteFileByEssenceIdAndEssenceTable(essenceId: number, essenceTable: string) {
        const file = await this.fileRepository.destroy({where: {essenceId: essenceId,
                essenceTable: essenceTable}});
        return file;
    }

    //Метод для удаления экземпляров модели File, у которых essenceTable=null или essenceId=null
    // или которые были созданы больше 1 часа
    async deleteAllTrashFiles() {
        const files = await this.fileRepository.findAll()
        const date = new Date
        const trash_files_list = files.filter(file => (file.createdAt.getTime() + 3600000) < date.getTime() ||
            file.essenceTable === null || file.essenceId === null)
        trash_files_list.forEach(file => {
            this.fileRepository.destroy({where: {id: file.id}});
        })
        return trash_files_list;
    }

    //Метод для удаления экземпляра модели File по id
    async deleteFileById(file_id: number) {
        const deleted_file = await this.fileRepository.destroy({where: {id: file_id}});
        return deleted_file
    }
}
