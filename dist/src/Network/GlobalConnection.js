import { AbstractSocketHandler } from "./AbstractSocketHandler";
class GlobalConnection extends AbstractSocketHandler {
    static event = "connection";
    handle() {
    }
}
export default GlobalConnection;
