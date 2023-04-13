import {ProfileService} from "../apps/profile/src/profile/profile.service";
import {Test, TestingModule} from "@nestjs/testing";
import {getModelToken} from "@nestjs/sequelize";
import {Profile} from "../apps/profile/src/profile/profile.model";
import {JwtModule} from "@nestjs/jwt";


describe('Testing ProfileController', () => {
    let service: ProfileService;

    const mockProfilesList = [{
        id: 1,
        user_id: 2,
        first_name: 'Stepan',
        second_name: 'Stepanov',
        phone: '89045674321',
        age: 42,
        country: 'USA'
    },

        {
            id: 2,
            user_id: 3,
            first_name: 'Ivan',
            second_name: 'Ivanov',
            phone: '89045674332',
            age: 33,
            country: 'RF'
        }
    ]

    const mockProfileRepository = {
        findAll: jest.fn().mockImplementation(() => mockProfilesList),
        create: jest.fn().mockImplementation(dto => dto),
        destroy: jest.fn().mockImplementation(profile_id => Promise.resolve({profile_id: profile_id})),
        update: jest.fn().mockImplementation((dto) => ({...dto}))
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProfileService, {
                provide: getModelToken(Profile),
                useValue: mockProfileRepository
            }],
            imports: [JwtModule.register({
                secret: process.env.SECRET_KEY || 'SECRET',
                signOptions: {
                    expiresIn: '24h'
                }

            })]
        }).compile()

        service = module.get<ProfileService>(ProfileService);
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    it("calling getAllProfiles method", () => {
        expect(service.getAllProfiles()).resolves.toEqual(mockProfilesList)
        expect(service.getAllProfiles()).not.toEqual([])
    })

    it("calling createProfile method", () => {
        const profileDto = {
            first_name: 'Stepan',
            second_name: 'Stepanov',
            phone: '89045674321',
            age: 42,
            country: 'USA',
            user_id: 1
        }
        expect(service.createProfile(profileDto)).resolves.toEqual({...profileDto})
    })

    it("calling deleteProfile method", async () => {
        const profile_id = 1;

        await expect(service.deleteProfile(profile_id)).resolves.toEqual( {"profile_id":
                {"where": {"id": profile_id}}})
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
        expect(service.updateProfile(UpdateDTO)).resolves.toEqual({
            user_id: 2,
            first_name: 'Stepan',
            second_name: 'Stepanov',
            phone: '89045674321',
            age: 42,
            country: 'USA'
        });
    })
})