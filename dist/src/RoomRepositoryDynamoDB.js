import { PutItemCommand, GetItemCommand, DeleteItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import Room from './Room';
class RoomRepositoryDynamoDB {
    ddb;
    TABLE_NAME;
    constructor(ddb, TABLE_NAME) {
        this.ddb = ddb;
        this.TABLE_NAME = TABLE_NAME;
    }
    async createRoom(name, capacity, owner) {
        const room = new Room(name, capacity);
        room.owner = owner;
        await this.ddb.send(new PutItemCommand({
            TableName: this.TABLE_NAME,
            Item: {
                id: { S: room.id },
                name: { S: room.name },
                capacity: { N: room.capacity.toString() },
                owner: { S: JSON.stringify(room.owner) }
            }
        }));
        return room;
    }
    async getRoom(id) {
        const result = await this.ddb.send(new GetItemCommand({
            TableName: this.TABLE_NAME,
            Key: { id: { S: id } }
        }));
        if (!result.Item)
            return undefined;
        const room = new Room(result.Item.name.S, parseInt(result.Item.capacity.N));
        room.id = result.Item.id.S;
        room.owner = JSON.parse(result.Item.owner.S);
        return room;
    }
    async updateRoom(room) {
        await this.ddb.send(new PutItemCommand({
            TableName: this.TABLE_NAME,
            Item: {
                id: { S: room.id },
                name: { S: room.name },
                capacity: { N: room.capacity.toString() },
                owner: { S: JSON.stringify(room.owner) }
            }
        }));
        return room;
    }
    async deleteRoom(id) {
        try {
            await this.ddb.send(new DeleteItemCommand({
                TableName: this.TABLE_NAME,
                Key: { id: { S: id } }
            }));
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async getAllRooms() {
        const result = await this.ddb.send(new ScanCommand({
            TableName: this.TABLE_NAME
        }));
        return (result.Items || []).map(item => {
            const room = new Room(item.name.S, parseInt(item.capacity.N));
            room.id = item.id.S;
            room.owner = JSON.parse(item.owner.S);
            return room;
        });
    }
}
export default RoomRepositoryDynamoDB;
