import { v4 as uuidv4 } from 'uuid';
import RoomStatus from './RoomStatus.js';
import Game from './Game.js';
import DIContainer from './DIContainer.js';
import ScorerOpenAI from './ScorerOpenAI.js';
import slugify from 'slugify';
class Room {
    constructor(name, capacity = 10, owner = null, isPublic = true) {
        this.id = uuidv4();
        this.name = name;
        this.slug = slugify.default(name, { lower: true });
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
    toJSON() {
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
            game: this.game?.toJSON(),
            isPublic: this.isPublic,
            currentRound: this.currentRound
        };
    }
    toString() {
        return `${this.slug} - (${this.clients.length} / ${this.capacity})`;
    }
    static createSinglePlayerRoom(client) {
        const room = new Room(client.username, 1, client, false);
        room.isPublic = false;
        room.owner = client;
        room.startGame();
        return room;
    }
    setUpNewGame() {
        this.game = Game.generateNewGame();
        this.status = RoomStatus.Waiting;
        this.updateRoom();
    }
    startGame() {
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
    handleSetInProgress() {
        console.log(`${this.slug} is starting...`);
        this.status = RoomStatus.InProgress;
        this.updateRoom();
    }
    handleRequestAnswersAndPassToGPT() {
        console.log(`${this.slug} is requesting answers...`);
        this.status = RoomStatus.Scoring;
        this.updateRoom();
        this.requestAnswers();
    }
    addClient(client) {
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
        // this.sendToAllClients("room:join", client);
        this.updateRoom();
        return [true, null];
    }
    removeClient(client) {
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
    hasClient(client) {
        return this.clients.includes(client);
    }
    updateRoom() {
        DIContainer.socketIO.to(this.slug).emit("room:data", this.toJSON());
    }
    sendToAllClients(msg, data) {
        DIContainer.socketIO.to(this.slug).emit(msg, data);
    }
    alertToAllClients(msg) {
        this.sendToAllClients("room:alert", msg);
    }
    destroy() {
        // Implementation will depend on your room management logic
    }
    requestAnswers() {
        this.sendToAllClients("room:requestAnswers", null);
    }
    isEveryoneReadyToGoToLobby() {
        return Object.values(this.clickedOkResults).every(val => val === true);
    }
    isEmpty() {
        return this.clients.length <= 0;
    }
    isFull() {
        return this.clients.length >= this.capacity;
    }
    hasEveryoneSubmittedAnswers() {
        return Object.keys(this.game.results).length === this.clients.length;
    }
    setOwner(client) {
        this.alertToAllClients(`${client.username} is now the owner of the room.`);
        this.owner = client;
    }
    async handleScoring() {
        console.log(`${this.slug} is scoring...`);
        this.game.hasBeenScored = true;
        // Start all the score calculations concurrently and wait for them to finish
        const scoreCalculations = await Promise.all(this.clients.map(client => {
            const scorer = new ScorerOpenAI("gpt-4o-mini", "strict");
            return scorer.scoreGame(this.game.letter, this.game.currentPrompts, this.game.results[client.id].answers);
        }));
        // Process the results after all calculations have completed
        let highScore = 0;
        // Loop through each client's answers
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
        // If everyone has 0, there's no winner so don't add for score
        if (this.game.winner) {
            this.scores[this.game.winner.id] += 1;
        }
        // Set room status to results
        this.status = RoomStatus.Results;
        this.updateRoom();
        // Send results
        DIContainer.socketIO.to(this.slug).emit("room:results", this.game.results);
        // Show the results for a bit before returning to the lobby
        setTimeout(() => {
            // Set to new round
            this.status = RoomStatus.Waiting;
            this.setUpNewGame();
            this.updateRoom();
        }, 1000 * Game.RESULTS_DURATION);
    }
}
export default Room;
