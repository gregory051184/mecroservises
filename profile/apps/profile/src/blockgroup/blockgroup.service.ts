import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {BlockGroup} from "./blockgroup.model";
import {BlockGroupDTO} from "./dto/create_blockGroup_dto";
import {UpdateBlockGroupDTO} from "./dto/update_blockGroup_dto";

// Создаём класс для работы с моделью BlockGroup
@Injectable()
export class BlockGroupService {

    constructor(@InjectModel(BlockGroup) private blockGroupRepository: typeof BlockGroup) {
    }

    //Метод для создания группы для блоков
    async createBlockGroup(dto: BlockGroupDTO) {
        const blockGroup = await this.blockGroupRepository.create(dto);
        return blockGroup;
    }

    //Метод для получения всех групп блоков
    async getAllBlockGroup() {
        const blockGroups = await this.blockGroupRepository.findAll({include: {all: true}});
        return blockGroups;
    }

    //Метод для получения группы блоков по id
    async getBlockGroupById(blockGroup_id: number) {
        const blockGroup = await this.blockGroupRepository.findOne({where:{id: blockGroup_id}});
        return blockGroup
    }

    //Метод для изменения группы блоков по id
    async updateBlockGroup(dto: UpdateBlockGroupDTO) {
        const blockGroup = await this.blockGroupRepository.update({
            value: dto.value, description: dto.description}, {where: {id: dto.id}});
        return blockGroup;
    }

    //Метод для удаления группы блоков по id
    async deleteBlockGroup(blockGroup_id) {
        const blockGroup = await this.blockGroupRepository.destroy({where: {id: blockGroup_id}});
        return blockGroup;
    }

}
