import ClientService from './ClientService.js';
import RoomService from './RoomService.js';
import ClientRepositoryMemory from './ClientRepositoryMemory.js';
import RoomRepositoryMemory from './RoomRepositoryMemory.js';
export class Container {
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
