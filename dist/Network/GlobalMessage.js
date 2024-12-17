import DIContainer from "../DIContainer.js";
import { AbstractSocketHandler } from "./AbstractSocketHandler.js";
class GlobalMessage extends AbstractSocketHandler {
    handle(data) {
        const msg = data?.message;
        if (msg?.trim() === "" || !msg) {
            this.sender.error(`Message can't be blank.`);
            return;
        }
        console.log(`${this.sender} sent message: ${msg}`);
        const formattedMsg = `${this.sender.username}: ${msg}`;
        DIContainer.socketIO.to("global").emit("global:message", formattedMsg);
    }
}
GlobalMessage.event = "global:message";
export default GlobalMessage;
