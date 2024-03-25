export class InstructionSet {
    static get(name) {
        const instruction = this.instructions.get(name);
        if (!instruction) {
            return undefined;
        }
        let copy = {};
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
            copy.run = (registers, ...args) => {
                instruction.run(registers, ...args);
            };
        }
        return copy;
    }
    static getByFunct(funct) {
        for (const instructionName of this.instructions.keys()) {
            const instruction = this.instructions.get(instructionName);
            if (instruction.funct === funct) {
                if (instruction.opcode !== 0x00)
                    throw new Error(``);
                return instruction;
            }
        }
        throw new Error(``);
    }
    static getByOpcode(opcode) {
        if (opcode === 0x00)
            throw new Error(``);
        for (const instructionName of this.instructions.keys()) {
            const instruction = this.instructions.get(instructionName);
            if (instruction.opcode === opcode) {
                return instruction;
            }
        }
        throw new Error(``);
    }
}
InstructionSet.instructions = new Map([
    ["add", { format: 'R', type: "ALU", opcode: 0x00, funct: 0x20,
            run: (registersObject, rs, rt, rd) => {
                const registers = registersObject.registers;
                // ADD rd, rs, rt
                // rd <- rs + rt
                registers[rd].value = registers[rs].value + registers[rt].value;
                // ------------------------------------------------------------
            }
        }],
    ["sub", { format: 'R', type: "ALU", opcode: 0x00, funct: 0x22,
            run: (registersObject, rs, rt, rd) => {
                const registers = registersObject.registers;
                // SUB rd, rs, rt
                // rd <- rs - rt
                registers[rd].value = registers[rs].value - registers[rt].value;
                // ------------------------------------------------------------
            }
        }],
    ["addi", { format: 'I', type: "ALU", opcode: 0x08,
            run: (registersObject, rs, rt, immediate) => {
                const registers = registersObject.registers;
                // ADDI rt, rs, immediate
                // rt <- rs + immediate
                registers[rt].value = registers[rs].value + immediate;
                // ------------------------------------------------------------
            }
        }]
]);
