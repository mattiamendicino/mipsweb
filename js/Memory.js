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
    printInConsole() {
        console.log("- MEMORY -");
        console.log("Address\t\tValue");
        for (const address of Array.from(this.memory.keys())) {
            const value = this.fetch(address);
            const hexAddress = "0x" + address.toString(16).padStart(8, '0');
            const hexValue = "0x" + (value ? value.toString(16).padStart(8, '0') : "00000000");
            console.log(`${hexAddress}\t${hexValue}`);
        }
        console.log("-");
    }
}
