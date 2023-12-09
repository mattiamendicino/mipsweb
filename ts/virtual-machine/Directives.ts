import {Memory} from "./Memory.js";
import {Registers} from "./Registers.js";
import {Assembler} from "./Assembler.js";

export type directive = {
    isSection?: boolean,
    assemble?(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler): void;
}

export class Directives {

    private static directives: Map<string, directive> = new Map<string, directive>([
        [".data", {
            isSection: true,
            assemble(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) {
                assembler.assembleData(lineNumber, parts, memory, registers);
            }
        }],
        [".text", {
            isSection: true,
            assemble(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) {
                assembler.assembleInstruction(lineNumber, parts, memory, registers);
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
        [".globl", {
            assemble(lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) {
                console.log(".globl", parts);
            }
        }],
    ]);

    static get(name: string): directive | undefined {
        const directive = this.directives.get(name);
        if (!directive) {
            return undefined;
        }
        let copy: directive = {};
        copy.isSection = directive.isSection;
        if (directive.assemble) {
            copy.assemble = (lineNumber: number, parts: string[], memory: Memory, registers: Registers, assembler: Assembler) => {
                directive.assemble!(lineNumber, parts, memory, registers, assembler);
            };
        }
        return copy;
    }

}