import {CPU} from "./CPU.js";
import {assembledLine, Assembler} from "./Assembler.js";


export class VirtualMachine {

    private cpu: CPU;
    private state: "edit" | "execute";
    private assembledInstructions?: assembledLine[];
    private assembledInstructionsIndex: number = 0;
    private nextInstruction?: number;

    constructor() {
        this.cpu = new CPU();
        this.state = "edit";
    }

    assemble(program: string) {
        const assembler = new Assembler();
        this.assembledInstructions = assembler.assemble(program, this.cpu.getMemory(), this.cpu.getRegisters());
        if (this.assembledInstructions.length > 0) {
            this.nextInstruction = this.assembledInstructions[0].sourceLine;
        }
        this.state = "execute";
    }

    run() {
        while (this.assembledInstructionsIndex < this.assembledInstructions!.length) {
            this.runInstruction();
        }
    }

    runInstruction() {
        if (this.assembledInstructionsIndex >= this.assembledInstructions!.length) return;
        this.cpu.runInstruction();
        this.assembledInstructionsIndex++;
        if (this.assembledInstructionsIndex >= this.assembledInstructions!.length) {
            this.nextInstruction = undefined;
            return;
        }
        this.nextInstruction = this.assembledInstructions![this.assembledInstructionsIndex].sourceLine;
    }

    stop() {
        this.assembledInstructionsIndex = 0;
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

    getSpecialRegister(name: string) {
        if(name === "pc") return { ...this.cpu.getRegisters().pc };
        if(name === "hi") return { ...this.cpu.getRegisters().hi };
        if(name === "lo") return { ...this.cpu.getRegisters().lo };
    }

    getRegisterByName(name: string) {
       return this.cpu.getRegisters().getByName(name);
    }

    getMemory() {
        return this.cpu.getMemoryCopy();
    }

}