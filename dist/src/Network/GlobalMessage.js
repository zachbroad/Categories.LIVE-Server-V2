import { AbstractSocketHandler } from "./AbstractSocketHandler";
export default class GlobalMessage extends AbstractSocketHandler {
    static event = "global:message";
    handle(data) {
        const msg = data?.message;
        if (msg?.trim() === "" || !msg) {
            this.sender.error(`Message can't be blank.`);
            return;
        }
        console.log(`${this.sender} sent message: ${msg}`);
        const formattedMsg = `${this.sender.username}: ${msg}`;
        this.io.emit("global:message", formattedMsg);
    }
}
