class AbstractMessage {
    io;
    socket;
    sender;
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
        this.sender = socket.data.user; // todo:
    }
}
export default AbstractMessage;
