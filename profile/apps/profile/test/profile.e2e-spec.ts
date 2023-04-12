import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {ProfileModule} from "../src/profile/profile.module";
import * as request from "supertest";
import {getModelToken} from "@nestjs/sequelize";
import {Profile} from "../src/profile/profile.model";

describe("ProfileController (e2e)", () => {
    let app: INestApplication;

    const mockProfileRepository = {}

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ProfileModule]
        })
            .overrideProvider(getModelToken(Profile))
            .useValue(mockProfileRepository)
            .compile()

        app = module.createNestApplication();
        await app.init();
    })

    it('/profile (GET)', () => {
        return request(app.getHttpServer())
            .get('/profile')
            .expect(403);
    })
})