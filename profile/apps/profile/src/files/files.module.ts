import {Module} from '@nestjs/common';
import {FilesController} from './files.controller';
import {FilesService} from './files.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {File} from "./files.model";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService],
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        SequelizeModule.forFeature([File])
    ]
})
export class FilesModule {
}
