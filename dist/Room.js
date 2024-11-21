import { v4 as uuidv4 } from 'uuid';
class Room {
    id;
    name;
    capacity;
    owner;
    constructor(name, capacity) {
        this.id = uuidv4();
        this.name = name;
        this.capacity = capacity;
        this.owner = null;
    }
}
export default Room;
