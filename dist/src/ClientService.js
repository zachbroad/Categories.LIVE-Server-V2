class ClientService {
    clientRepository;
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    async createClient(client) {
        return this.clientRepository.createClient(client);
    }
    async getClient(id) {
        return this.clientRepository.getClient(id);
    }
    async updateClient(client) {
        return this.clientRepository.updateClient(client);
    }
    async deleteClient(id) {
        return this.clientRepository.deleteClient(id);
    }
}
export default ClientService;
