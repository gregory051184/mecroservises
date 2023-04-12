import {Test, TestingModule} from '@nestjs/testing';
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {getModelToken} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {RolesService} from "../roles/roles.service";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {UpdateUserDTO} from "./dto/update_user_dto";
import any = jasmine.any;


describe("UsersController Unit Tests", () => {
    let controller: UsersController;
    //let spyService: UsersService

    //beforeAll(async () => {
    //    const ApiServiceProvider = {
    //        provide: UsersService,
    //        useFactory: () => ({
    //            getAll: jest.fn(() => []),
    //findAllNotes: jest.fn(() => []),
    //findOneNote: jest.fn(() => { }),
    //updateNote: jest.fn(() => { }),
    //deleteNote: jest.fn(() => { })

    //        })


    const mockUsersService = {
        findAll: jest.fn(),
        destroy: jest.fn(({'where':{'id': undefined}}) => {}),
        hash: jest.fn(password => {}),
        update: jest.fn((dto:{'where': {'id': 1}}) => {})
    }


    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService, {provide: getModelToken(User), useValue: mockUsersService},
                RolesService, {provide: getModelToken(Role), useValue: mockUsersService},
                AuthService, {provide: getModelToken(User), useValue: mockUsersService},
                JwtService,
                {
                    provide: "USER_AUTH_SERVICE",
                    useValue: {
                        emit: jest.fn(),
                    }
                }],
            //imports: [AuthModule, SequelizeModule.forFeature([User, Role, UserRoles])]
        })
            //.overrideProvider(UsersService)
            //.useValue(mockUsersService)
            .compile();

        controller = app.get<UsersController>(UsersController);
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    //spyService = app.get<UsersService>(UsersService);


    //it("calling getAll method", () => {
    //    //const dto = new UserDTO();
    //    expect(noteController.saveNote(dto)).not.toEqual(null);
    //})
    //
    //it("calling saveNotes method", () => {
    //    const dto = new CreateNoteDto();
    //    noteController.saveNote(dto);
    //    expect(spyService.saveNote).toHaveBeenCalled();
    //    expect(spyService.saveNote).toHaveBeenCalledWith(dto);
    //})


    it("calling getAll users", () => {
        controller.getAll();
        expect(mockUsersService.findAll).toHaveBeenCalled();
    })

    it("calling deleteUser", () => {
        controller.delete(1)
        expect(mockUsersService.destroy).toHaveBeenCalledWith({'where':{'id': undefined}})
    })

    it("calling updateUser", () => {
        expect(controller.create({email: 'e@email.ru', password: '123', first_name: 'Vitaliy', second_name: 'Siskin',
            phone: '89000000012', age: 28, country: 'USA'})).toEqual({id: expect.any(Number),
            email: 'e@email.ru', password: '123'})
        //expect(mockUsersService.destroy).toHaveBeenCalledWith({'where':{'id': undefined}})
    })

    //it("calling find getAll method", () => {
    //    const dto = new GetNoteById();
    //    dto.id = '3789';
    //    noteController.getNoteById(dto);
    //    expect(spyService.findOneNote).toHaveBeenCalled();
    //})

});


