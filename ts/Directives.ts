import {Memory} from "./Memory.js";
import {Registers} from "./Registers.js";

export type Directive = {
    parent?: string | undefined,
    assemble?(line: string, memory: Memory, registers: Registers): void;
}

export class Directives {

    private static directives: Map<string, Directive> = new Map<string, Directive>([
        [".data", {}],
        [".text", {}],
        [".align", {
            parent: ".data",
            assemble(line: string, memory: Memory, registers: Registers) {

            }
        }],
        [".space", {
            parent: ".data",
            assemble(line: string, memory: Memory, registers: Registers) {

            }
        }],
        [".globl", {
            parent: ".text",
            assemble(line: string, memory: Memory, registers: Registers) {

            }
        }],
    ]);

    static get(name: string): Directive | undefined {
        const directive = this.directives.get(name);
        if (!directive) {
            return undefined;
        }
        let copy: Directive = {};
        if (directive.parent) {
            copy.parent = directive.parent;
        }
        if (directive.assemble) {
            copy.assemble = (line: string, memory: Memory, registers: Registers) => {
                directive.assemble!(line, memory, registers);
            };
        }
        return copy;
    }

}