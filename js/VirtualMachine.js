import { CPU } from "./CPU.js";
import { Assembler } from "./Assembler.js";
export class VirtualMachine {
    constructor() {
        this.assembledLinesIndex = 0;
        this.cpu = new CPU();
        this.state = "edit";
    }
    assemble(program) {
        const assembler = new Assembler();
        this.assembledLines = assembler.assemble(program, this.cpu.getMemory(), this.cpu.getRegisters());
        this.nextInstruction = this.assembledLines[0].sourceLine;
        this.state = "execute";
    }
    run() {
        while (this.assembledLinesIndex < this.assembledLines.length) {
            this.runInstruction();
        }
    }
    runInstruction() {
        if (this.assembledLinesIndex >= this.assembledLines.length)
            return;
        this.cpu.runInstruction();
        this.assembledLinesIndex++;
        if (this.assembledLinesIndex >= this.assembledLines.length) {
            this.nextInstruction = undefined;
            return;
        }
        this.nextInstruction = this.assembledLines[this.assembledLinesIndex].sourceLine;
    }
    stop() {
        this.assembledLinesIndex = 0;
        this.cpu.clear();
        this.state = "edit";
    }
    getState() {
        return this.state;
    }
    getNextInstructionLine() {
        return this.nextInstruction;
    }
    getRegisters() {
        return this.cpu.getRegisters().registers.map(register => (Object.assign({}, register)));
    }
    getSpecialRegister(registerName) {
        if (registerName === "pc")
            return Object.assign({}, this.cpu.getRegisters().pc);
        if (registerName === "hi")
            return Object.assign({}, this.cpu.getRegisters().hi);
        if (registerName === "lo")
            return Object.assign({}, this.cpu.getRegisters().lo);
    }
}
