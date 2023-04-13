import {ProfileController} from "../apps/profile/src/profile/profile.controller";
import {Test, TestingModule} from "@nestjs/testing";
import {ProfileService} from "../apps/profile/src/profile/profile.service";
import {getModelToken} from "@nestjs/sequelize";
import {Profile} from "../apps/profile/src/profile/profile.model";
import {JwtModule} from "@nestjs/jwt";
import {ClientsModule, Transport} from "@nestjs/microservices";

describe('Testing ProfileController', () => {
    let controller: ProfileController;

    const mockProfileService = {
        findAll: jest.fn(),
        update: jest.fn().mockImplementation((dto) => ({...dto})),
        findOne: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [ProfileService, {
                provide: getModelToken(Profile),
                useValue: mockProfileService
            }
            ],
            imports: [JwtModule.register({
                secret: process.env.SECRET_KEY || 'SECRET',
                signOptions: {
                    expiresIn: '24h'
                }

            }),
                ClientsModule.register([
                    {
                        name: 'PROFILE_REGISTRATION_SERVICE',
                        transport: Transport.RMQ,
                        options: {
                            urls: ['amqp://localhost:5672'],
                            queue: 'profile_queue',
                            queueOptions: {
                                durable: false
                            },
                        },
                    },
                ]),
            ]
        }).compile()

        controller = module.get<ProfileController>(ProfileController);
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    it("calling getAllProfiles method", () => {
        const spy = jest.spyOn(controller, "getAllProfile");
        controller.getAllProfile();
        expect(spy).toHaveBeenCalled()

    })

    it("calling user_registration method", () => {
        const registrationDTO = {
            email: 'stepanov@gmail.com',
            password: '123',
            first_name: 'Stepan',
            second_name: 'Stepanov',
            phone: '89045674321',
            age: 42,
            country: 'USA'
        }
        const spy = jest.spyOn(controller, "user_registration");
        controller.user_registration(registrationDTO);
        expect(spy).toHaveBeenCalled();
        expect(spy.mock.calls).toHaveLength(1);
    })

    it("calling update method", () => {
        const UpdateDTO = {
            id: 1,
            user_id: 2,
            first_name: 'Stepan',
            second_name: 'Stepanov',
            phone: '89045674321',
            age: 42,
            country: 'USA'
        };
        expect(controller.update(UpdateDTO)).resolves.toEqual({
            user_id: 2,
            first_name: 'Stepan',
            second_name: 'Stepanov',
            phone: '89045674321',
            age: 42,
            country: 'USA'
        });
    })

    it("calling getOwnProfile method", async () => {
        const profile_id = 1
        const profileDTO = {
            id: 1,
            user_id: 2,
            first_name: 'Stepan',
            second_name: 'Stepanov',
            phone: '89045674321',
            age: 42,
            country: 'USA'
        }
        const spy = jest.spyOn(controller, "getOwnProfile");
        await controller.getOwnProfile(profile_id);
        expect(spy).toHaveBeenCalled()

    })



})