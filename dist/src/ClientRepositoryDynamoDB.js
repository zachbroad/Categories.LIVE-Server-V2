import Client from "./Client";
import { PutItemCommand, GetItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
class ClientRepositoryDynamoDB {
    ddb;
    TABLE_NAME;
    constructor(ddb, TABLE_NAME) {
        this.ddb = ddb;
        this.TABLE_NAME = TABLE_NAME;
    }
    async createClient(client) {
        await this.ddb.send(new PutItemCommand({
            TableName: this.TABLE_NAME,
            Item: {
                id: { S: client.id },
                username: { S: client.username }
            }
        }));
        return client;
    }
    async getClient(id) {
        const result = await this.ddb.send(new GetItemCommand({
            TableName: this.TABLE_NAME,
            Key: { id: { S: id } }
        }));
        if (!result.Item) {
            return undefined;
        }
        return this.mapToClient(result.Item);
    }
    async updateClient(client) {
        await this.ddb.send(new PutItemCommand({
            TableName: this.TABLE_NAME,
            Item: {
                id: { S: client.id },
                username: { S: client.username }
            }
        }));
        return client;
    }
    async deleteClient(id) {
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
    mapToClient(item) {
        const client = new Client(item.username.S, item.id.S, item.address.S);
        client.id = item.id.S;
        return client;
    }
}
export default ClientRepositoryDynamoDB;
