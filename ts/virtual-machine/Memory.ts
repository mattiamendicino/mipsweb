export type word = number;

export class Memory {

    private memory: Map<word, word> = new Map<word, word>();

    static word(number: number): word {
        // TODO: Convert number to word
        return number as word;
    }

    clear() {
        this.memory.clear();
    }

    store(address: word, value: word) {
        this.memory.set(Memory.word(address), Memory.word(value));
    }

    fetch(address: word) {
        return this.memory.get(Memory.word(address));
    }

    get() {
        const copy = new Map<word, word>();
        for (const address of Array.from(this.memory.keys())) {
            copy.set(address, this.memory.get(address)!);
        }
        return copy;
    }

}