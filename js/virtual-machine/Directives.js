export class Directives {
    static get(name) {
        const directive = this.directives.get(name);
        if (!directive) {
            return undefined;
        }
        let copy = {};
        copy.isSection = directive.isSection;
        if (directive.assemble) {
            copy.assemble = (lineNumber, parts, memory, registers, assembler) => {
                directive.assemble(lineNumber, parts, memory, registers, assembler);
            };
        }
        return copy;
    }
}
Directives.directives = new Map([
    [".data", {
            isSection: true,
            assemble(lineNumber, parts, memory, registers, assembler) {
                assembler.assembleData(lineNumber, parts, memory, registers);
            }
        }],
    [".text", {
            isSection: true,
            assemble(lineNumber, parts, memory, registers, assembler) {
                assembler.assembleInstruction(lineNumber, parts, memory, registers);
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
    [".globl", {
            assemble(lineNumber, parts, memory, registers, assembler) {
                console.log(".globl", parts);
            }
        }],
]);
