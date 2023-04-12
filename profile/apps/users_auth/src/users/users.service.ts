import {HttpException, HttpStatus, Injectable, Req} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {UserDTO} from "./dto/create_user_dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDTO} from "./dto/add_role_dto";
import * as bcrypt from "bcryptjs";
import {UpdateUserDTO} from "./dto/update_user_dto";
//import {AuthService} from "../auth/auth.service";

// Создаём класс для работы с моделью User
@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private rolesService: RolesService,

    ) {
    }
    //Метод для создания экземпляра пользователя
    async createUser(dto: UserDTO) {
        console.log(dto)
        const hash_password = await bcrypt.hash(dto.password, 5); // шифруем полученный из запроса пароль
        const user = await this.userRepository.create({...dto, password: hash_password});
        const role = await this.rolesService.getRoleByValue('USER'); // получаем роль "USER"
        await user.$set('roles', [role.id]); // Добавляем эту роль новому пользователю,
        // т.е. каждый пользователь при создании сразу получает роль "USER"
        user.roles = [role];
        return user;
    }

    //Метод для получения всех пользователей и связанных с этими пользователями других моделей
    async getAll() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    //Метод для получения пользователя по email
    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }

    //Метод для получения изменения пользователя (получаем пользователя по id)
    async updateUser(dto: UpdateUserDTO) {
        const hash_password = await bcrypt.hash(dto.password, 5); // шифруем полученный из запроса пароль
        const updating_user = await this.userRepository.update({id: dto.id, email: dto.email,
            password: hash_password}, {where: {id: dto.id}});
        return updating_user;
    }74

    //Метод для удаления пользователя (получаем пользователя по id)
    async deleteUser(user_id: number) {
        const user = await this.userRepository.destroy({where: {id: user_id}});
        return user;
    }

    //Метод для добавления ролей пользователю (получаем пользователя по id)
    async addRole(dto: AddRoleDTO) {
        const user = await this.userRepository.findByPk(dto.user_id);
        const role = await this.rolesService.getRoleByValue(dto.value); // получаем роль по названию
        if (user && role) {
            await user.$add('role', role.id); //добавляем роль пользователю
            return dto
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
    }

}
