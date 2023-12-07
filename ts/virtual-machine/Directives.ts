import {Memory} from "./Memory.js";
import {Registers} from "./Registers.js";

export type directive = {
    segment?: boolean,
    assemble?(line: string, memory: Memory, registers: Registers): void;
}

export class Directives {

    private static directives: Map<string, directive> = new Map<string, directive>([
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

    static get(name: string): directive | undefined {
        const directive = this.directives.get(name);
        if (!directive) {
            return undefined;
        }
        let copy: directive = {};
        copy.segment = directive.segment;
        if (directive.assemble) {
            copy.assemble = (line: string, memory: Memory, registers: Registers) => {
                directive.assemble!(line, memory, registers);
            };
        }
        return copy;
    }

}