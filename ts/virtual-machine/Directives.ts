import {Memory} from "./Memory.js";
import {Registers} from "./Registers.js";
import {Assembler} from "./Assembler.js";

export type directive = {
    assemble(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler): void;
}

export class Directives {

    private static directives: Map<string, directive> = new Map<string, directive>([
        [".data", {
            assemble(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) {
                console.log(".data", parts);
                if (parts.length > 0 && parts[0] === ".data") parts = parts.slice(1);
                assembler.assembleData(lineNumber, parts, memory, registers);
            }
        }],
        [".align", {
            assemble(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) {
                console.log(".align", parts);
            }
        }],
        [".space", {
            assemble(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) {
                console.log(".space", parts);
            }
        }],
        [".asciiz", {
            assemble(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) {
                console.log(".asciiz", parts);
            }
        }],
        [".text", {
            assemble(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) {
                console.log(".text", parts);
                if (parts.length > 0 && parts[0] === ".text") parts = parts.slice(1);
                assembler.assembleInstruction(lineNumber, parts, memory, registers);
            }
        }]
    ]);

    static get(name: string): directive | undefined {
        const directive = this.directives.get(name);
        if (!directive) {
            return undefined;
        }
        return {
            assemble: (lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) => {
                directive.assemble(lineNumber, parts, memory, registers, assembler);
            }
        };
    }

}