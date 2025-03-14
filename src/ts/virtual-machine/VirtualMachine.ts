import {CPU} from "./CPU.js";
import {file} from "../files.js";
import {Assembler} from "./Assembler.js";
import {Console} from "./Console.js";
import {Binary} from "./Utils.js";
import {renderApp} from "../app.js";

export class VirtualMachine {

    cpu: CPU;
    assembler: Assembler;
    running: boolean;

    nextInstructionEditorPosition: {fileId: number, lineNumber: number} | undefined;

    lastChangedRegister?: string;

    console: Console = new Console();

    private asyncToken: number = 0;

    constructor(cpu: CPU) {
        this.cpu = cpu;
        this.assembler = new Assembler(this.cpu);
        this.running = false;
    }

    assemble(files: file[]) {
        this.stop();
        try {
            this.assembler.assembleFiles(files);
            this.nextInstructionEditorPosition = this.assembler.addressEditorsPositions.get(this.cpu.pc.getValue());
        } catch (error) {
            // @ts-ignore
            this.console.addLine(`Assemble: ${error.message}`, "error");
            console.error(error);
        }

    }

    stop() {
        this.reset();
    }

    reset() {
        this.cpu.reset();
        this.assembler.reset();
        this.running = false;
        this.nextInstructionEditorPosition = undefined;
        this.lastChangedRegister = undefined;
        this.console.reset();
        this.asyncToken++;
    }

    async step() {
        try {
            if (!this.cpu.isHalted() && this.nextInstructionEditorPosition !== undefined) {
                await this.cpu.execute(this);
                if (!this.cpu.isHalted()) {
                    this.nextInstructionEditorPosition = this.assembler.addressEditorsPositions.get(this.cpu.pc.getValue());
                }
            } else {
                this.pause();
            }
        } catch (error) {
            // @ts-ignore
            this.console.addLine(`${error.message}`, "error");
            console.error(error);
            this.pause();
        }
    }

    async run() {
        this.running = true;
        while (this.running && !this.cpu.isHalted()) {
            await this.step();
        }
    }

    pause() {
        this.running = false;
    }

    async exit() {
        this.cpu.halt();
        this.pause();
        this.nextInstructionEditorPosition = undefined;
        await renderApp("execute");
    }

    getRegisters() {
        const registers = [];
        for (const register of this.cpu.getRegisters()) {
            registers.push({name: register.name, number: register.number, value: register.binary.getValue()});
        }
        registers.push({name: "pc", value: this.cpu.pc.getValue()});
        registers.push({name: "hi", value: this.cpu.hi.getValue()});
        registers.push({name: "lo", value: this.cpu.lo.getValue()});
        return registers;
    }

    getMemory() {
        return Array.from(this.cpu.getMemory().entries()).map(([address, binary]): {address: number, binary: Binary, tags: {name: string, type: string}[]} => ({
            address,
            binary: binary,
            tags: []
        }));
    }

    getCurrentAsyncToken(): number {
        return this.asyncToken;
    }

}