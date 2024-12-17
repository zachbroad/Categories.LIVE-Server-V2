import Room from './Room';
class RoomRepositoryMemory {
    rooms;
    constructor() {
        this.rooms = new Map();
    }
    async createRoom(name, capacity, owner) {
        const room = new Room(name, capacity);
        room.owner = owner;
        this.rooms.set(room.slug, room);
        return room;
    }
    async getRoom(slug) {
        return this.rooms.get(slug);
    }
    async updateRoom(room) {
        this.rooms.set(room.slug, room);
        return room;
    }
    async deleteRoom(slug) {
        return this.rooms.delete(slug);
    }
    async getAllRooms() {
        return Array.from(this.rooms.values());
    }
}
export default RoomRepositoryMemory;
