export class Memory {
    constructor() {
        this.memory = new Map();
    }
    static word(number) {
        // TODO: Convert number to word
        return number;
    }
    clear() {
        this.memory.clear();
    }
    store(address, value) {
        this.memory.set(Memory.word(address), Memory.word(value));
    }
    fetch(address) {
        return this.memory.get(Memory.word(address));
    }
    get() {
        const copy = new Map();
        for (const address of Array.from(this.memory.keys())) {
            copy.set(address, this.memory.get(address));
        }
        return copy;
    }
}
