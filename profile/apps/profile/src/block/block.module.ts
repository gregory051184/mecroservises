import {Module} from '@nestjs/common';
import {SequelizeModule} from '@nestjs/sequelize';
import {BlockController} from './block.controller';
import {BlockService} from './block.service';
import {Block} from "./block.model";
import {FileWork} from "../filework/filework.model";
import {BlockGroup} from "../blockgroup/blockgroup.model";
import {FileWorkModule} from "../filework/filework.module";
import {FilesModule} from "../files/files.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [BlockController],
    providers: [BlockService],
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        SequelizeModule.forFeature([Block, BlockGroup, FileWork]),
        FilesModule,
        FileWorkModule
    ]
})
export class BlockModule {
}
