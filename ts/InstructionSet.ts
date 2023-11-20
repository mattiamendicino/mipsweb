import {Registers} from "./Registers.js";
import {word} from "./Memory.js";

export type Instruction = {
    format?: 'R' | 'I' | 'J';
    type?: "ALU" | "LOAD" | "STORE" | "BRANCH" | "JUMP";
    opcode?: word;
    funct?: word;
    run?: (registers: Registers, ...args: word[]) => void;
}

export class InstructionSet {

    private static instructions: Map<string, Instruction> = new Map<string, Instruction>([
        ["add", { format: 'R', type: "ALU", opcode: 0x00, funct: 0x20,
            run: () => {
                console.log("add");
            }
        }],
        ["sub", { format: 'R', type: "ALU", opcode: 0x00, funct: 0x22,
            run: () => {
                console.log("sub");
            }
        }],
        ["addi", { format: 'I', type: "ALU", opcode: 0x08,
            run: () => {
                console.log("addi");
            }
        }],
    ]);

    static get(name: string): Instruction | undefined {
        const instruction = this.instructions.get(name);
        if (!instruction) {
            return undefined;
        }
        let copy: Instruction = {};
        if (instruction.format) {
            copy.format = instruction.format;
        }
        if (instruction.type) {
            copy.type = instruction.type;
        }
        if (instruction.opcode) {
            copy.opcode = instruction.opcode;
        }
        if (instruction.funct) {
            copy.funct = instruction.funct;
        }
        if (instruction.run) {
            copy.run = (registers: Registers, ...args: word[]) => {
                instruction.run!(registers, ...args);
            };
        }
        return copy;
    }

}