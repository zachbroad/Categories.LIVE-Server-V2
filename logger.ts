class Logger {
	constructor(private readonly prefix: string) {}

	log(message: string) {
		console.log(`${this.prefix} ${message}`);
	}

	error(message: string) {
		console.error(`${this.prefix} ${message}`);
	}   
}

export const logger = new Logger('Server');
