import { v4 as uuidv4 } from 'uuid';

class Room {
	public id: string;
	public name: string;
	public capacity: number;
	public owner: User;

	constructor(name: string, capacity: number) {
		this.id = uuidv4();
		this.name = name;
		this.capacity = capacity;
	}
}

export default Room;
