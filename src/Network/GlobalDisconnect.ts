import { AbstractSocketHandler } from "./AbstractSocketHandler";
import { Server, Socket } from "socket.io";

class GlobalDisconnect extends AbstractSocketHandler {
    public static event = "disconnect";

    handle(data: any): void {
        console.log(`Handling ${this}'s disconnection`);
        // get client
        const client = this.client;

        // get their current room
        let room = this.room;

        if (room) {
            // Remove from room if they're in a room
            console.log(`${this} is in room ${room}, removing...`);
            room.removeClient(this);

            // Is the room now empty? If so, let's delete it.
            if (room.isEmpty()) {
                console.log(`Room ${room.slug} is empty... destroying!`);
                room.destroy();
            }

        } else {
            console.log(`${this} is not in any rooms...`);
        }
    }
}

export default GlobalDisconnect;