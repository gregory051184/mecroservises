import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {ProfileDTO} from "./dto/create_profile_dto";
import {RegistrationDTO} from "./dto/create_registration_dto";
import {UpdateProfileDTO} from "./dto/update_profile_dto";
import {JwtService} from "@nestjs/jwt";


// Создаём класс для работы с моделью Profile
@Injectable()
export class ProfileService {

    constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
                private jwtService: JwtService,
    ) {
    }

    async registrationThroughAuth(regDto: RegistrationDTO, token: any) {
        const user_id = await this.jwtService.verify(token.token)['id'];
        const profile = await this.profileRepository.create({first_name: regDto.first_name, second_name: regDto.second_name,
            phone: regDto.phone, age: regDto.age, country: regDto.country, user_id: user_id});
        return profile;
    }

    //Метод для регистрации пользователя и профиля пользователя (при создании пользователя происходит авторизация
    // и через jwt-token передаёт user_id для регистрации профиля)
    //async registrationThroughAuth(regDto: RegistrationDTO) {
    //    console.log(regDto)
    //    const user = await this.usersService.getUserByEmail(regDto.email);
    //    if (user) { // проверяем нет ли уже такого пользователя
    //        throw new HttpException('Такой пользователь уже существует', HttpStatus.BAD_REQUEST)
    //    }
    //    await this.usersService.createUser({email: regDto.email, password: regDto.password});
    //    // авторизуем созданного пользователя
    //    const authenticateUser = await this.authService.login({email: regDto.email, password: regDto.password})
    //    console.log('Авторизация пройдена')
    //    const user_id = await this.jwtService.verify(authenticateUser.token)['id'] // получаем id пользователя из токена
    //    await this.profileRepository.create({
    //        first_name: regDto.first_name,
    //        second_name: regDto.second_name, phone: regDto.phone, age: regDto.age, country: regDto.country,
    //        user_id: user_id
    //    })
    //    return authenticateUser;
    //}

    //Метод для регистрации пользователя и профиля пользователя (при создании пользователя
    //передаётся user_id для регистрации профиля без авторизации пользователя)
    //async registration(regDto: RegistrationDTO) {
    //    const user = await this.usersService.getUserByEmail(regDto.email);
    //    if (user) { // проверяем нет ли уже такого пользователя
    //        throw new HttpException('Такой пользователь уже существует', HttpStatus.BAD_REQUEST)
                //    }
    //    const new_user = await this.usersService.createUser({email: regDto.email, password: regDto.password});
    //    await this.profileRepository.create({
    //        first_name: regDto.first_name,
    //        second_name: regDto.second_name, phone: regDto.phone, age: regDto.age, country: regDto.country,
    //        user_id: new_user.id // передаём id пользователя
            //    })
    //    return this.authService.generateToken(new_user);
    //}

    //Метод создания профиля без взаимодействия с моделью User
    async createProfile(dto: ProfileDTO) {
        const profile = await this.profileRepository.create(dto);
        return profile;
    }

    //Метод для получения всех профилей
    async getAllProfiles() {
        const profiles = await this.profileRepository.findAll({include: {all: true}});
        return profiles;
    }

    //Метод для получения профиля по id
    async getProfileById(profile_id: number) {
        const profile = await this.profileRepository.findOne({where: {id: profile_id}, include: {all: true}});
        return profile;
    }

    async getProfileByUser_Id(user_id: number) {
        const profile = await this.profileRepository.findOne({where: {user_id: user_id}, include: {all: true}});
        return profile;
    }

    //Метод для получения профиля по номеру телефона
    async getProfileByPhone(phone: string) {
        const profile = await this.profileRepository.findOne({where: {phone}});
        return profile;
    }

    //Метод для изменения профиля (получаем пользователя по id) обязательно передать верный user_id
    async updateProfile(dto: UpdateProfileDTO) {
        const updating_profile = await this.profileRepository.update({first_name: dto.first_name,
            second_name: dto.second_name, phone: dto.phone, age: dto.age, country: dto.country, user_id: dto.user_id
        }, {where: {id: dto.id}});
        return updating_profile;
    }

    //Метод для удаления профиля (получаем пользователя по id). При удалении профиля удаляется и пользователь
    async deleteProfile(profile_id: number) {
        const profile = await this.profileRepository.destroy({where: {id: profile_id}}) // получаем профиль по id
        //await this.usersService.deleteUser(profile.user_id); // Удаляем пользователя и связанный с ним профиль,
        // т.к. удалив пользователя удаляется профиль с ним связанный
        return profile;
    }
}
