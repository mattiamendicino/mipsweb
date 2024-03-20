export class Memory {
    constructor() {
        this.memory = new Map();
    }
    static word(number) {
        if (!Number.isInteger(number))
            throw new Error('');
        return number | 0;
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
        const sortedKeys = Array.from(this.memory.keys()).sort((a, b) => a - b);
        const sortedMemory = new Map();
        for (const key of sortedKeys) {
            sortedMemory.set(key, this.memory.get(key));
        }
        return sortedMemory;
    }
}
