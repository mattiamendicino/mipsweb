import {CPU} from "./CPU.js";
import {AssembledLine, Assembler} from "./Assembler.js";


export class VirtualMachine {

    private cpu: CPU;
    private state: "edit" | "execute";
    private assembledLines?: AssembledLine[];
    private assembledLinesIndex: number = 0;
    private nextInstruction?: number;

    constructor() {
        this.cpu = new CPU();
        this.state = "edit";
    }

    assemble(program: string) {
        const assembler = new Assembler();
        this.assembledLines = assembler.assemble(program, this.cpu.getMemory(), this.cpu.getRegisters());
        this.nextInstruction = this.assembledLines[0].sourceLine;
        this.state = "execute";
    }

    run() {
        while (this.assembledLinesIndex < this.assembledLines!.length) {
            this.runInstruction();
        }
    }

    runInstruction() {
        if (this.assembledLinesIndex >= this.assembledLines!.length) return;
        this.cpu.runInstruction();
        this.assembledLinesIndex++;
        if (this.assembledLinesIndex >= this.assembledLines!.length) {
            this.nextInstruction = undefined;
            return;
        }
        this.nextInstruction = this.assembledLines![this.assembledLinesIndex].sourceLine;
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
        return this.cpu.getRegisters().registers.map(register => ({ ...register }));
    }

    getSpecialRegister(registerName: string) {
        if(registerName === "pc") return { ...this.cpu.getRegisters().pc };
        if(registerName === "hi") return { ...this.cpu.getRegisters().hi };
        if(registerName === "lo") return { ...this.cpu.getRegisters().lo };
    }

}