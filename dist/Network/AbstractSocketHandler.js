export class AbstractSocketHandler {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.sender = socket.data.user; // todo:
    }
}
