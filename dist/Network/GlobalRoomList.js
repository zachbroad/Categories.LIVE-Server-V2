import DIContainer from "../DIContainer.js";
import { AbstractSocketHandler } from "./AbstractSocketHandler.js";
class GlobalRoomList extends AbstractSocketHandler {
    async handle(data) {
        const roomService = DIContainer.roomService;
        const rooms = await roomService.getAllRooms();
        this.socket.emit('globalRoomList', rooms);
    }
}
GlobalRoomList.event = "globalRoomList";
export default GlobalRoomList;
