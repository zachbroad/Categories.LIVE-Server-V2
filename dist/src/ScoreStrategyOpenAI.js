import "dotenv/config";
import OpenAI from "openai";
import BaseScorer from "./BaseScorer";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
class ScoreStrategyOpenAI extends BaseScorer {
    model;
    constructor(model, prompt) {
        super(prompt);
        this.model = model;
    }
    async scoreGame(letter, prompts, answers) {
        const response = await openai.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: "user",
                    content: this.formatPrompt(letter, prompts, answers),
                }
            ]
        });
        return JSON.parse(response.choices[0].message.content ?? "[]");
    }
}
export default ScoreStrategyOpenAI;
