import fs from "fs";
import _ from "lodash";
import ScoreStrategyOpenAI from "./ScoreStrategyOpenAI.js";
class Game {
    constructor(letter = "A") {
        this.rounds = Game.NUMBER_OF_ROUNDS;
        this.currentRound = 1;
        this.cards = Game.generateCards();
        this.results = {};
        this.hasBeenScored = false;
        this.setOfLetters = Game.DICE_LETTERS;
        this.letter = letter;
        this.lobbyDuration = Game.LOBBY_DURATION;
        this.resultsDuration = Game.RESULTS_DURATION;
        this.roundDuration = Game.ROUND_DURATION;
        this.currentPrompts = [];
        this.setPromptsToThisRound();
        this.winner = null;
    }
    toJSON() {
        return {
            rounds: this.rounds,
            currentRound: this.currentRound,
            cards: this.cards,
            results: this.results,
            hasBeenScored: this.hasBeenScored,
            setOfLetters: this.setOfLetters,
            letter: this.letter,
            lobbyDuration: this.lobbyDuration,
            resultsDuration: this.resultsDuration,
            roundDuration: this.roundDuration,
            currentPrompts: this.currentPrompts,
            winner: this.winner,
        };
    }
    /**
     * Generate a list of random prompts from prompts.txt by reading the file and shuffling the lines
     * @param count - number of prompts to generate
     * @returns {string[]} - list of prompts
     */
    static generateRandomPrompts(count = 20) {
        let data = [];
        const fileData = fs.readFileSync("./data/prompts.txt", "utf8");
        data = _.shuffle(fileData.split(/\n/)).slice(0, count);
        return data;
    }
    /**
     * Generate a single card
     * @returns {string[]} - a single card
     */
    static generateCard() {
        return this.generateRandomPrompts();
    }
    /**
     * Generate 3 cards for a game
     * @returns {string[][]} - 3 cards
     */
    static generateCards() {
        return [this.generateCard(), this.generateCard(), this.generateCard()];
    }
    /**
     * Generate a new game with a random letter and prompts
     * @returns {Game} - new game object
     */
    static generateNewGame() {
        const g = new Game();
        g.setOfLetters = Game.DICE_LETTERS;
        g.letter = g.getLetterFromList();
        return g;
    }
    /**
     * Set the prompts to the current round card prompts
     */
    setPromptsToThisRound() {
        this.currentPrompts = this.cards[this.currentRound - 1];
    }
    /**
     * Get a random letter from the list of letters specified
     * @returns {string} - random letter
     */
    getLetterFromList() {
        return this.setOfLetters[Math.floor(Math.random() * this.setOfLetters.length)];
    }
}
// Timer
Game.LOBBY_DURATION = 3;
Game.NUMBER_OF_ROUNDS = 3;
Game.RESULTS_DURATION = 60;
Game.ROUND_DURATION = 6;
Game.WAIT_FOR_ANSWERS_DURATION = 3.5;
Game.SCORE_STRATEGIES = {
    STRICT_GPT4o: new ScoreStrategyOpenAI("gpt-4o", "strict"),
    LENIENT_GPT4o: new ScoreStrategyOpenAI("gpt-4o", "lenient"),
    STRICT_GPT4o_Mini: new ScoreStrategyOpenAI("gpt-4o-mini", "strict"),
    LENIENT_GPT4o_Mini: new ScoreStrategyOpenAI("gpt-4o-mini", "lenient"),
};
// Scattergories letters
Game.DICE_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "W"];
Game.EASY_LETTERS = ["A", "E", "I", "O", "U", "B", "C", "D", "G", "L", "M", "N", "P", "R", "S", "T"];
Game.ANY_LETTER = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
Game.HARD_LETTERS = ["Q", "U", "V", "X", "Y", "Z", "J", "K", "W"];
export default Game;
