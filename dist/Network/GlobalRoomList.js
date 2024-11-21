import DIContainer from "../DIContainer";
import AbstractMessage from "./AbstractMessage";
class GlobalRoomList extends AbstractMessage {
    async process(data) {
        const roomService = DIContainer.roomService;
        const rooms = await roomService.getAllRooms();
        this.socket.emit('globalRoomList', rooms);
    }
}
export default GlobalRoomList;
