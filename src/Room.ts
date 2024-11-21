import { v4 as uuidv4 } from 'uuid';
import Client from './Client';
import RoomStatus from './RoomStatus';
import ChatMessage from './ChatMessage';
import slugify from 'slugify';
import Game from './Game';
import assert from 'assert';
import DIContainer from './DIContainer';

class Room {
	public id: UUID;
	public name: string;
	public slug: string;
	public capacity: number;
	public owner: Client | null;
	public status: RoomStatus;
	public clients: Client[];
	public chat: ChatMessage[];
	public scores: Record<string, number>;
	public clickedOkResults: Record<string, boolean>;
	public isPublic: boolean;
	public currentRound: number;
	public game: Game | null;

	constructor(name: string, capacity: number = 10, owner: Client | null = null, isPublic: boolean = true) {
		this.id = uuidv4();
		this.name = name;
		this.slug = slugify(name, { lower: true });
		this.capacity = capacity;
		this.status = RoomStatus.Waiting;
		this.clients = [];
		this.owner = owner;
		this.chat = [];
		this.scores = {};
		this.clickedOkResults = {};
		this.game = null;
		this.setUpNewGame();

		this.isPublic = isPublic;
		this.currentRound = 1;
	}

	public toJSON(): object {
		return {
			id: this.id,
			name: this.name,
			slug: this.slug,
			capacity: this.capacity,
			status: this.status,
			clients: this.clients.map(client => client.toJSON()),
			owner: this.owner ? this.owner.toJSON() : null,
			chat: this.chat,
			scores: this.scores,
			clickedOkResults: this.clickedOkResults,
			game: this.game,
			isPublic: this.isPublic,
			currentRound: this.currentRound
		};
	}

	public toString(): string {
		return `${this.slug} - (${this.clients.length} / ${this.capacity})`;
	}

	public static createSinglePlayerRoom(client: Client): Room {
		const room = new Room(client.username, 1, client, false);
		room.isPublic = false;
		room.owner = client;
		room.startGame();
		return room;
	}

	public setUpNewGame(): void {
		this.game = Game.generateNewGame();
		this.status = RoomStatus.Waiting;
		this.updateRoom();
	}

	public startGame(): void {
		if (!this.game) {
			console.error(`${this.slug} has no game to start!`);
			return;
		}

		this.status = RoomStatus.Starting;
		this.updateRoom();

		console.log(`Set ${this.slug} status to Starting`);
		console.log(`${this.slug} will start in ${Game.LOBBY_DURATION} seconds.`);

		setTimeout(() => {
			this.handleSetInProgress();

			setTimeout(() => {
				this.handleRequestAnswersAndPassToGPT();

				setTimeout(async () => {
					if (!this.game.hasBeenScored) {
						this.handleScoring();
					}
				}, 1000 * Game.WAIT_FOR_ANSWERS_DURATION);
			}, 1000 * Game.ROUND_DURATION);
		}, 1000 * Game.LOBBY_DURATION);
	}

	private handleSetInProgress(): void {
		console.log(`${this.slug} is starting...`);
		this.status = RoomStatus.InProgress;
		this.updateRoom();
	}

	private handleRequestAnswersAndPassToGPT(): void {
		console.log(`${this.slug} is requesting answers...`);
		this.status = RoomStatus.Scoring;
		this.updateRoom();
		this.requestAnswers();
	}

	private async handleScoring(): Promise<void> {
		if (!this.game) {
			console.error(`${this.slug} has no game to score!`);
			return;
		}

		console.log(`${this.slug} is scoring...`);
		this.game.hasBeenScored = true;

		const scoreCalculations = await Promise.all(
			this.clients.map(client => 
				this.scoreGame(this.game.letter, this.game.currentPrompts, this.game.results[client.id].answers)
			)
		);

		let highScore = 0;

		scoreCalculations.forEach((scoredAnswers, index) => {
			const client = this.clients[index];
			const score = scoredAnswers.reduce((a, b) => a + b, 0);

			this.clickedOkResults[client.id] = false;
			this.game.results[client.id].results = scoredAnswers;
			this.game.results[client.id].score = score;

			if (score > highScore) {
				highScore = score;
				this.game.winner = client;
			}
		});

		if (this.game.winner) {
			this.scores[this.game.winner.id] += 1;
		}

		this.status = RoomStatus.Results;
		this.updateRoom();

		this.sendToAllClients("room:results", this.game.results);

		setTimeout(() => {
			this.status = RoomStatus.Waiting;
			this.setUpNewGame();
			this.updateRoom();
		}, 1000 * Game.RESULTS_DURATION);
	}

	public addClient(client: Client): [boolean, string | null] {
		if (this.hasClient(client)) {
			client.error("You're already in that room!");
			return [false, "Client is already in room"];
		}

		if (this.isFull()) {
			client.error("That room is full!");
			return [false, "That room is full!"];
		}

		if (!(client.id in this.scores)) {
			this.scores[client.id] = 0;
		}

		client.roomSlug = this.slug;
		client.socket.join(this.slug);

		this.clients = this.clients.concat(client);
		client.message(`You joined ${this.name}`);

		this.sendToAllClients("room:join", client);
		this.updateRoom();

		return [true, null];
	}

	public removeClient(client: Client): [boolean, string | null] {
		if (!this.hasClient(client)) {
			const errorMessage = `${client} is not in room ${this.slug}`;
			console.error(errorMessage);
			return [false, errorMessage];
		}

		this.clients = this.clients.filter(p => p.socket.id !== client.socket.id);
		console.log(`${client} removed from ${this}`);

		if (this.isEmpty()) {
			console.log(`${this} is empty, deleting...`);
			this.destroy();
			return [true, null];
		}

		if (this.owner === client) {
			this.setOwner(this.clients[0]);
			this.clients[0].message(`You are now the owner of ${this.name}.`);
		}

		this.sendToAllClients("alert", `${client.username} left the room.`);

		return [true, null];
	}

	public hasClient(client: Client): boolean {
		return this.clients.includes(client);
	}

	public updateRoom(): void {
		DIContainer.socketIO.to(this.slug).emit("room:data", this.toJSON());
	}

	public sendToAllClients(msg: string, data: any): void {
		// Implementation will depend on your socket setup
	}

	public alertToAllClients(msg: string): void {
		this.sendToAllClients("room:alert", msg);
	}

	public destroy(): void {
		// Implementation will depend on your room management logic
	}

	public requestAnswers(): void {
		this.sendToAllClients("room:requestAnswers", null);
	}

	public isEveryoneReadyToGoToLobby(): boolean {
		return Object.values(this.clickedOkResults).every(val => val === true);
	}

	public isEmpty(): boolean {
		return this.clients.length <= 0;
	}

	public isFull(): boolean {
		return this.clients.length >= this.capacity;
	}

	public hasEveryoneSubmittedAnswers(): boolean {
		return Object.keys(this.game.results).length === this.clients.length;
	}

	public setOwner(client: Client): void {
		this.alertToAllClients(`${client.username} is now the owner of the room.`);
		this.owner = client;
	}

	private async scoreGame(letter: string, prompts: string[], answers: string[]): Promise<number[]> {
		// Implementation will depend on your scoring logic
		return [];
	}
}

export default Room;
