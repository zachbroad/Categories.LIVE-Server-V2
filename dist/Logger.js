class Logger {
    constructor() { }
    static log(message) {
        console.log(`${message}`);
    }
    static error(message) {
        console.error(`${message}`);
    }
}
export default Logger;
