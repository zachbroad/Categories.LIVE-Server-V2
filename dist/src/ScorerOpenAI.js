import OpenAI from "openai";
import BaseScorer from "./BaseScorer";
class ScorerOpenAI extends BaseScorer {
    model;
    promptRuleType;
    openai;
    constructor(model, promptRuleType, openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })) {
        super(promptRuleType);
        this.model = model;
        this.promptRuleType = promptRuleType;
        this.openai = openai;
    }
    async scoreGame(letter, prompts, answers) {
        const prompt = this.formatPrompt(letter, prompts, answers);
        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 128,
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.0,
        });
        return JSON.parse(response.choices[0].message.content ?? "");
    }
}
export default ScorerOpenAI;
