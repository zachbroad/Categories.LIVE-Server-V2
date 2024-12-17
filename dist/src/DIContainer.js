import ClientService from './ClientService';
import RoomService from './RoomService';
import ClientRepositoryMemory from './ClientRepositoryMemory';
import RoomRepositoryMemory from './RoomRepositoryMemory';
export class Container {
    static instance;
    _clientService;
    _roomService;
    _socketIO;
    constructor(ddb) {
        const clientRepository = new ClientRepositoryMemory();
        const roomRepository = new RoomRepositoryMemory();
        this._clientService = new ClientService(clientRepository);
        this._roomService = new RoomService(roomRepository);
    }
    static initialize(ddb) {
        if (Container.instance) {
            throw new Error('Container is already initialized');
        }
        Container.instance = new Container(ddb);
    }
    static get clientService() {
        if (!Container.instance) {
            throw new Error('Container must be initialized before use');
        }
        return Container.instance._clientService;
    }
    static get roomService() {
        if (!Container.instance) {
            throw new Error('Container must be initialized before use');
        }
        return Container.instance._roomService;
    }
    static get socketIO() {
        if (!Container.instance) {
            throw new Error('Container must be initialized before use');
        }
        return Container.instance._socketIO;
    }
    static setSocketIO(socketIO) {
        if (!Container.instance) {
            throw new Error('Container must be initialized before use');
        }
        Container.instance._socketIO = socketIO;
    }
}
export default Container;
