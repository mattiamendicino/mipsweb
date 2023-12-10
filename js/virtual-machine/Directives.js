export class Directives {
    static get(name) {
        const directive = this.directives.get(name);
        if (!directive) {
            return undefined;
        }
        return {
            assemble: (lineNumber, parts, memory, registers, assembler) => {
                directive.assemble(lineNumber, parts, memory, registers, assembler);
            }
        };
    }
}
Directives.directives = new Map([
    [".data", {
            assemble(lineNumber, parts, memory, registers, assembler) {
                console.log(".data", parts);
                if (parts.length > 0 && parts[0] === ".data")
                    parts = parts.slice(1);
                assembler.assembleData(lineNumber, parts, memory, registers);
            }
        }],
    [".align", {
            assemble(lineNumber, parts, memory, registers, assembler) {
                console.log(".align", parts);
            }
        }],
    [".space", {
            assemble(lineNumber, parts, memory, registers, assembler) {
                console.log(".space", parts);
            }
        }],
    [".asciiz", {
            assemble(lineNumber, parts, memory, registers, assembler) {
                console.log(".asciiz", parts);
            }
        }],
    [".text", {
            assemble(lineNumber, parts, memory, registers, assembler) {
                console.log(".text", parts);
                if (parts.length > 0 && parts[0] === ".text")
                    parts = parts.slice(1);
                assembler.assembleInstruction(lineNumber, parts, memory, registers);
            }
        }]
]);
