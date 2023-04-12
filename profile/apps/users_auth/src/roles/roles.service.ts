import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {RoleDTO} from "./dto/create_role_dto";
import {UpdateRoleDTO} from "./dto/update_role_dto";


// Создаём класс для работы с моделью Role
@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {
    }

    //Метод для создания экземпляра роли
    async createRole(dto: RoleDTO) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    //Метод для получения всех ролей
    async getAllRoles() {
        const roles = await this.roleRepository.findAll();
        return roles;
    }

    //Метод для получения ролей по названию
    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        return role
    }

    //Метод для изменения роли (получаем роль по id)
    async updateRole(dto: UpdateRoleDTO) {
        const updating_role = await this.roleRepository.update({value: dto.value, description: dto.description},
            {where: {id: dto.id}});
        return updating_role;
    }

    //Метод для удаления роли (получаем роль по id)
    async deleteRole(role_id: number) {
        const role = await this.roleRepository.destroy({where: {id: role_id}});
        return role;
    }
}