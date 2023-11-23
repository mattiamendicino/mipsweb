import {Memory} from "./Memory.js";
import {Registers} from "./Registers.js";

export type Directive = {
    segment?: boolean,
    assemble?(line: string, memory: Memory, registers: Registers): void;
}

export class Directives {

    private static directives: Map<string, Directive> = new Map<string, Directive>([
        [".data", {
            segment: true
        }],
        [".text", {
            segment: true
        }],
        [".align", {
            assemble(line: string, memory: Memory, registers: Registers) {
            }
        }],
        [".space", {
            assemble(line: string, memory: Memory, registers: Registers) {

            }
        }],
        [".globl", {
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
        copy.segment = directive.segment;
        if (directive.assemble) {
            copy.assemble = (line: string, memory: Memory, registers: Registers) => {
                directive.assemble!(line, memory, registers);
            };
        }
        return copy;
    }

}