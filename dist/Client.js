import DIContainer from "./DIContainer.js";
class Client {
    constructor(socket, name = "No Name", address) {
        this.socket = socket;
        this.id = socket.id;
        this.username = name;
        this.address = address;
        this.roomSlug = null;
    }
    async getRoom() {
        if (this.roomSlug) {
            return DIContainer.roomService.getRoom(this.roomSlug);
        }
        return undefined;
    }
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            address: this.address,
            roomSlug: this.roomSlug,
        };
    }
    toString() {
        return `${this.username}@(${this.address})`;
    }
    send(msg, data = {}) {
        this.socket.emit(msg, data);
    }
    message(msg) {
        console.log(`[${this.toString()}]: ${msg}`);
        this.socket.emit("message", msg);
    }
    error(message) {
        this.socket.emit('serverMessage', `[ERROR] ${message}`);
    }
    leaveRoom(room) {
        if (room.clients.includes(this)) {
            room.removeClient(this);
            this.roomSlug = null;
        }
        else {
            this.error(`You are not in room ${room.slug}`);
        }
    }
    async handleDisconnect() {
        console.log(`${this.username} disconnected.`);
        let room = await this.getRoom();
        if (room) {
            console.log(`${this.username} was in room ${room.slug}, leaving...`);
            this.leaveRoom(room);
            if (room.isEmpty()) {
                console.log(`${room.slug} is empty, deleting...`);
                await DIContainer.roomService.deleteRoom(room.id);
            }
            this.roomSlug = null;
        }
        else {
            console.log(`${this.username} was not in any room.`);
        }
    }
    async sendListOfRooms() {
        const rooms = await DIContainer.roomService.getAllRooms();
        DIContainer.socketIO.to(this.socket.id).emit("global:roomList", rooms);
    }
    async getCurrentRoom() {
        if (!this.roomSlug) {
            return undefined;
        }
        return await DIContainer.roomService.getRoom(this.roomSlug);
    }
    async setUsername(name) {
        console.log(`${this.username} is changing their name to ${name}`);
        this.username = name;
        const room = await this.getCurrentRoom();
        if (room) {
            DIContainer.roomService.updateRoom(room)
                .then((room) => {
                console.log(`${room.slug} updated`);
            })
                .catch((error) => {
                console.error(error);
                this.error("Failed to change name");
            });
        }
    }
}
export default Client;
