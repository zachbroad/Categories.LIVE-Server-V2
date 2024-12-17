class RoomService {
    roomRepository;
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async createRoom(slug, capacity, owner) {
        return this.roomRepository.createRoom(slug, capacity, owner);
    }
    async getRoom(slug) {
        return this.roomRepository.getRoom(slug);
    }
    async updateRoom(room) {
        return this.roomRepository.updateRoom(room);
    }
    async deleteRoom(slug) {
        return this.roomRepository.deleteRoom(slug);
    }
    async getAllRooms() {
        return this.roomRepository.getAllRooms(); // TODO: handle private/public rooms
    }
}
export default RoomService;
