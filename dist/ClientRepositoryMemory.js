class ClientRepositoryMemory {
    constructor() {
        this.clients = new Map();
    }
    async createClient(client) {
        this.clients.set(client.id, client);
        return client;
    }
    async getClient(id) {
        return this.clients.get(id);
    }
    async updateClient(client) {
        this.clients.set(client.id, client);
        return client;
    }
    async deleteClient(id) {
        return this.clients.delete(id);
    }
    async getClients() {
        return Array.from(this.clients.values());
    }
}
export default ClientRepositoryMemory;
