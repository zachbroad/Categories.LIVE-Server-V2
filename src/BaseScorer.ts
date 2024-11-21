import IScorer from "./IScorer";

class BaseScorer implements IScorer {
    private prompt: string;

    constructor(prompt: PromptRuleType) {
        this.prompt = PROMPT_MAP[prompt];
    }

    async scoreGame(letter: string, prompts: string[], answers: string[]): Promise<number[]> {
        throw new Error("Method not implemented.");
    }

    protected formatPrompt(letter: string, prompts: string[], answers: string[]) {
        return (this as any).prompt.concat(`Letter: ${letter}\nPrompts: ${prompts}\nAnswers: ${answers}`);
    }
}

export default BaseScorer;