import {Module} from '@nestjs/common';
import {ProfileModule} from './src/profile/profile.module';
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {Profile} from "./src/profile/profile.model";
import { FilesModule } from './src/files/files.module';
import { FileWorkModule } from './src/filework/filework.module';
import { BlockModule } from './src/block/block.module';
import { BlockGroupModule } from './src/blockgroup/blockgroup.module';
import {FileWork} from "./src/filework/filework.model";

@Module({
  imports: [
    ProfileModule,
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Profile, FileWork,],
      autoLoadModels: true
    }),
    FilesModule,
    FileWorkModule,
    BlockModule,
    BlockGroupModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
