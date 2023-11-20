import {CPU} from "./CPU.js";
import {AssembledLine, Assembler} from "./Assembler.js";


export class VirtualMachine {

    private cpu: CPU;
    private state: "edit" | "execute";
    private assembledLines?: AssembledLine[];

    constructor() {
        this.cpu = new CPU();
        this.state = "edit";
    }

    assemble(program: string) {
        const assembler = new Assembler();
        const assembledLines = assembler.assemble(program, this.cpu.getMemory(), this.cpu.getRegisters());
        this.state = "execute";
    }

    run() {
        console.log("run");
    }

    runInstruction() {
        console.log("runInstruction");
    }

    stop() {
        this.cpu.clear();
        this.state = "edit";
    }

    getState() {
        return this.state;
    }

}