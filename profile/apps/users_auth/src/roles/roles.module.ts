import {forwardRef, Module} from '@nestjs/common';
import {RolesController} from './roles.controller';
import {RolesService} from './roles.service';
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {SequelizeModule} from "@nestjs/sequelize";
import {UserRoles} from "./userRoles.model";
import {AuthModule} from "../auth/auth.module";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [
        SequelizeModule.forFeature([Role, User, UserRoles]),
        forwardRef(() => AuthModule)],
    exports: [RolesService]
})
export class RolesModule {
}
