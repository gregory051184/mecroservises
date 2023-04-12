import {forwardRef, Module} from '@nestjs/common';
import {UsersModule} from './src/users/users.module';
import {RolesModule} from './src/roles/roles.module';
import {User} from "./src/users/users.model";
import {Role} from "./src/roles/roles.model";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {UserRoles} from "./src/roles/userRoles.model";
import {AuthModule} from "./src/auth/auth.module";



@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: "users_auth",
            models: [User, Role, UserRoles],
            autoLoadModels: true
        }),
        UsersModule,
        RolesModule,
        forwardRef(() =>AuthModule)
    ]

})
export class AppModule {
}
