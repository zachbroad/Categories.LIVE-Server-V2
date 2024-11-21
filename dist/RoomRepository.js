import AWS from 'aws-sdk';
import Room from './Room';
import { DB_CONFIG } from './Config';
const ddb = new AWS.DynamoDB.DocumentClient();
class RoomRepository {
    ddb;
    TABLE_NAME;
    constructor(ddb, TABLE_NAME) {
        this.ddb = ddb;
        this.TABLE_NAME = TABLE_NAME;
    }
    async createRoom(name, capacity, owner) {
        const room = new Room(name, capacity);
        room.owner = owner;
        await ddb.put({
            TableName: DB_CONFIG.ROOM_TABLE,
            Item: {
                id: room.id,
                name: room.name,
                capacity: room.capacity,
                owner: room.owner
            }
        }).promise();
        return room;
    }
    async getRoom(id) {
        const result = await ddb.get({
            TableName: DB_CONFIG.ROOM_TABLE,
            Key: { id }
        }).promise();
        if (!result.Item)
            return undefined;
        const room = new Room(result.Item.name, result.Item.capacity);
        room.id = result.Item.id;
        room.owner = result.Item.owner;
        return room;
    }
    async updateRoom(room) {
        await ddb.put({
            TableName: DB_CONFIG.ROOM_TABLE,
            Item: room
        }).promise();
        return room;
    }
    async deleteRoom(id) {
        try {
            await ddb.delete({
                TableName: DB_CONFIG.ROOM_TABLE,
                Key: { id }
            }).promise();
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async getAllRooms() {
        const result = await ddb.scan({
            TableName: DB_CONFIG.ROOM_TABLE
        }).promise();
        return (result.Items || []).map(item => {
            const room = new Room(item.name, item.capacity);
            room.id = item.id;
            room.owner = item.owner;
            return room;
        });
    }
}
export default RoomRepository;
