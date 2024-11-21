import User from "./User";
class UserRepository {
    ddb;
    TABLE_NAME;
    constructor(ddb, TABLE_NAME) {
        this.ddb = ddb;
        this.TABLE_NAME = TABLE_NAME;
    }
    async createUser(user) {
        await this.ddb.put({
            TableName: this.TABLE_NAME,
            Item: user
        }).promise();
        return user;
    }
    async getUser(id) {
        const result = await this.ddb.get({
            TableName: this.TABLE_NAME,
            Key: { id }
        }).promise();
        if (!result.Item) {
            return undefined;
        }
        return this.mapToUser(result.Item);
    }
    async updateUser(user) {
        await this.ddb.put({
            TableName: this.TABLE_NAME,
            Item: user
        }).promise();
        return user;
    }
    async deleteUser(id) {
        try {
            await this.ddb.delete({
                TableName: this.TABLE_NAME,
                Key: { id }
            }).promise();
            return true;
        }
        catch (error) {
            return false;
        }
    }
    mapToUser(item) {
        const user = new User(item.name);
        user.id = item.id;
        return user;
    }
}
export default UserRepository;
