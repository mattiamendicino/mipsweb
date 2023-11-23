import { Memory } from "./Memory.js";
import { Registers } from "./Registers.js";
import { InstructionSet } from "./InstructionSet.js";
export class CPU {
    constructor() {
        this.memory = new Memory();
        this.registers = new Registers();
    }
    clear() {
        this.registers.clear();
        this.memory.clear();
    }
    getMemory() {
        return this.memory;
    }
    getRegisters() {
        return this.registers;
    }
    runInstruction() {
        const binary = this.memory.fetch(Memory.word(this.registers.pc.value));
        if (!binary)
            return;
        const opcode = CPU.getBits(binary, 31, 26);
        if (opcode === 0x00) {
            const funct = CPU.getBits(binary, 5, 0);
            const instruction = InstructionSet.getByFunct(funct);
            if (instruction.format === "R") {
                this.runInstructionR(binary, instruction);
            }
        }
        else {
            const instruction = InstructionSet.getByOpcode(opcode);
            if (instruction.format === "I") {
                this.runInstructionI(binary, instruction);
            }
            if (instruction.format === "J") {
                this.runInstructionJ(binary, instruction);
            }
        }
        this.registers.pc.value += 4;
    }
    static getBits(word, to, from) {
        return (word << (31 - to)) >>> (31 - to + from);
    }
    runInstructionR(binary, instruction) {
        const rs = CPU.getBits(binary, 25, 21);
        const rt = CPU.getBits(binary, 20, 16);
        const rd = CPU.getBits(binary, 15, 11);
        instruction.run(this.registers, rs, rt, rd);
    }
    runInstructionI(binary, instruction) {
        const rs = CPU.getBits(binary, 25, 21);
        const rt = CPU.getBits(binary, 20, 16);
        const immediate = CPU.getBits(binary, 15, 0);
        instruction.run(this.registers, rs, rt, immediate);
    }
    runInstructionJ(binary, instruction) {
        const address = CPU.getBits(binary, 25, 0);
        instruction.run(this.registers, address);
    }
}
