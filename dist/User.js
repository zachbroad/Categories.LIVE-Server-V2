class User {
    id;
    name;
    socket;
    constructor(socket) {
        this.socket = socket;
        this.id = socket.id;
        this.name = `User ${socket.id}`;
    }
    message(message) {
        this.socket.emit('serverMessage', message);
    }
    error(message) {
        this.socket.emit('serverMessage', `[ERROR] ${message}`);
    }
}
export default User;
