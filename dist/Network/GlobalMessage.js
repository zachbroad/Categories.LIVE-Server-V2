import AbstractMessage from "./AbstractMessage";
export default class GlobalMessage extends AbstractMessage {
    process(data) {
        const msg = data?.message;
        if (msg?.trim() === "" || !msg) {
            this.sender.error(`Message can't be blank.`);
            return;
        }
        console.log(`${this.sender} sent message: ${msg}`);
        const formattedMsg = `${this.sender.name}: ${msg}`;
        this.io.emit("global:message", formattedMsg);
    }
}
