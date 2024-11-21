import UserService from './UserService';
import RoomService from './RoomService';
import UserRepository from './UserRepository';
import RoomRepository from './RoomRepository';
import { DB_CONFIG } from './Config';
export class Container {
    static instance;
    _userService;
    _roomService;
    constructor(ddb) {
        const userRepository = new UserRepository(ddb, DB_CONFIG.USER_TABLE);
        const roomRepository = new RoomRepository(ddb, DB_CONFIG.ROOM_TABLE);
        this._userService = new UserService(userRepository);
        this._roomService = new RoomService(roomRepository);
    }
    static initialize(ddb) {
        if (Container.instance) {
            throw new Error('Container is already initialized');
        }
        Container.instance = new Container(ddb);
    }
    static get userService() {
        if (!Container.instance) {
            throw new Error('Container must be initialized before use');
        }
        return Container.instance._userService;
    }
    static get roomService() {
        if (!Container.instance) {
            throw new Error('Container must be initialized before use');
        }
        return Container.instance._roomService;
    }
}
export default Container;
