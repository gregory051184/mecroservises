import {Module} from '@nestjs/common';
import {FileWorkController} from './filework.controller';
import {FileWorkService} from './filework.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {FileWork} from "./filework.model";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [FileWorkController],
    providers: [FileWorkService],
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        SequelizeModule.forFeature([FileWork])
    ],
    exports: [
        FileWorkService
    ]
})
export class FileWorkModule {
}
