import { AbstractSocketHandler } from "./AbstractSocketHandler.js";
class GlobalConnection extends AbstractSocketHandler {
    handle() {
    }
}
GlobalConnection.event = "connection";
export default GlobalConnection;
