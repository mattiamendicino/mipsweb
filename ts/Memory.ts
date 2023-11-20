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

    store(address: number, value: number) {
        this.memory.set(Memory.word(address), Memory.word(value));
    }

    fetch(address: number) {
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