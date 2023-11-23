export class Directives {
    static get(name) {
        const directive = this.directives.get(name);
        if (!directive) {
            return undefined;
        }
        let copy = {};
        copy.segment = directive.segment;
        if (directive.assemble) {
            copy.assemble = (line, memory, registers) => {
                directive.assemble(line, memory, registers);
            };
        }
        return copy;
    }
}
Directives.directives = new Map([
    [".data", {
            segment: true
        }],
    [".text", {
            segment: true
        }],
    [".align", {
            assemble(line, memory, registers) {
            }
        }],
    [".space", {
            assemble(line, memory, registers) {
            }
        }],
    [".globl", {
            assemble(line, memory, registers) {
            }
        }],
]);
