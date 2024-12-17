import DIContainer from "../DIContainer";
import { AbstractSocketHandler } from "./AbstractSocketHandler";
class GlobalRoomList extends AbstractSocketHandler {
    static event = "globalRoomList";
    async handle(data) {
        const roomService = DIContainer.roomService;
        const rooms = await roomService.getAllRooms();
        this.socket.emit('globalRoomList', rooms);
    }
}
export default GlobalRoomList;
