import {Module} from '@nestjs/common';
import {BlockGroupController} from './blockgroup.controller';
import {BlockGroupService} from './blockgroup.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {BlockGroup} from "./blockgroup.model";
import {Block} from "../block/block.model";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [BlockGroupController],
    providers: [BlockGroupService],
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        SequelizeModule.forFeature([BlockGroup, Block])
    ]
})
export class BlockGroupModule {
}
