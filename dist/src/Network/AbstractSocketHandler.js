export class AbstractSocketHandler {
    static event;
    io;
    socket;
    sender;
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.sender = socket.data.user; // todo:
    }
}
