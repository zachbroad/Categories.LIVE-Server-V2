import PROMPT_MAP from "./Prompts/PromptMap";
class BaseScorer {
    prompt;
    constructor(promptRuleType) {
        this.prompt = PROMPT_MAP[promptRuleType];
    }
    async scoreGame(letter, prompts, answers) {
        throw new Error("Method not implemented.");
    }
    formatPrompt(letter, prompts, answers) {
        return this.prompt.concat(`Letter: ${letter}\nPrompts: ${prompts}\nAnswers: ${answers}`);
    }
}
export default BaseScorer;
