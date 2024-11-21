class RoomService {
    roomRepository;
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async createRoom(name, capacity, owner) {
        return this.roomRepository.createRoom(name, capacity, owner);
    }
    async getRoom(id) {
        return this.roomRepository.getRoom(id);
    }
    async updateRoom(room) {
        return this.roomRepository.updateRoom(room);
    }
    async deleteRoom(id) {
        return this.roomRepository.deleteRoom(id);
    }
    async getAllRooms() {
        return this.roomRepository.getAllRooms();
    }
}
export default RoomService;
