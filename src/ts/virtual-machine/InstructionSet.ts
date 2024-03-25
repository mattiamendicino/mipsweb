import {word} from "./Memory.js";
import {Registers} from "./Registers.js";


export type instruction = {
    format?: 'R' | 'I' | 'J';
    type?: "ALU" | "LOAD" | "STORE" | "BRANCH" | "JUMP";
    opcode?: word;
    funct?: word;
    run?: (registersObject: Registers, ...args: word[]) => void;
}

export class InstructionSet {

    private static instructions: Map<string, instruction> = new Map<string, instruction>([
        ["add", { format: 'R', type: "ALU", opcode: 0x00, funct: 0x20,
            run: (registersObject: Registers, rs: word, rt: word, rd: word) => {
                const registers = registersObject.registers;
                // ADD rd, rs, rt
                // rd <- rs + rt
                registers[rd].value = registers[rs].value + registers[rt].value;
                // ------------------------------------------------------------
            }
        }],
        ["sub", { format: 'R', type: "ALU", opcode: 0x00, funct: 0x22,
            run: (registersObject: Registers, rs: word, rt: word, rd: word) => {
                const registers = registersObject.registers;
                // SUB rd, rs, rt
                // rd <- rs - rt
                registers[rd].value = registers[rs].value - registers[rt].value;
                // ------------------------------------------------------------
            }
        }],
        ["addi", { format: 'I', type: "ALU", opcode: 0x08,
            run: (registersObject: Registers, rs: word, rt: word, immediate: word) => {
                const registers = registersObject.registers;
                // ADDI rt, rs, immediate
                // rt <- rs + immediate
                registers[rt].value = registers[rs].value + immediate;
                // ------------------------------------------------------------
            }
        }]
    ]);

    static get(name: string): instruction | undefined {
        const instruction = this.instructions.get(name);
        if (!instruction) {
            return undefined;
        }
        let copy: instruction = {};
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

    static getByFunct(funct: word): instruction {
        for(const instructionName of this.instructions.keys()) {
            const instruction = this.instructions.get(instructionName)!;
            if (instruction.funct === funct) {
                if (instruction.opcode !== 0x00) throw new Error(``);
                return instruction;
            }
        }
        throw new Error(``);
    }

    static getByOpcode(opcode: word): instruction {
        if (opcode === 0x00) throw new Error(``);
        for(const instructionName of this.instructions.keys()) {
            const instruction = this.instructions.get(instructionName)!;
            if (instruction.opcode === opcode) {
                return instruction;
            }
        }
        throw new Error(``);
    }

}