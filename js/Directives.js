export class Directives {
    static get(name) {
        const directive = this.directives.get(name);
        if (!directive) {
            return undefined;
        }
        let copy = {};
        if (directive.parent) {
            copy.parent = directive.parent;
        }
        if (directive.assemble) {
            copy.assemble = (line, memory, registers) => {
                directive.assemble(line, memory, registers);
            };
        }
        return copy;
    }
}
Directives.directives = new Map([
    [".data", {}],
    [".text", {}],
    [".align", {
            parent: ".data",
            assemble(line, memory, registers) {
            }
        }],
    [".space", {
            parent: ".data",
            assemble(line, memory, registers) {
            }
        }],
    [".globl", {
            parent: ".text",
            assemble(line, memory, registers) {
            }
        }],
]);
