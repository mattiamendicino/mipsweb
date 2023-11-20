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
}
InstructionSet.instructions = new Map([
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
