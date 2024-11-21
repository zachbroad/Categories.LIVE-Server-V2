class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(user) {
        return this.userRepository.createUser(user);
    }
    async getUser(id) {
        return this.userRepository.getUser(id);
    }
    async updateUser(user) {
        return this.userRepository.updateUser(user);
    }
    async deleteUser(id) {
        return this.userRepository.deleteUser(id);
    }
}
export default UserService;
