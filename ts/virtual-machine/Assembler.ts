import {Memory, word} from "./Memory.js";
import {Register, Registers} from "./Registers.js";
import {Directive, Directives} from "./Directives.js";
import {Instruction, InstructionSet} from "./InstructionSet.js";

export type AssembledLine = {
    sourceLine: number,
    basicInstruction: string,
    binaryInstruction: word,
    address: word
}

export class Assembler {

    private assembledLines: AssembledLine[] = [];
    private currentDirective: Directive = Directives.get(".text")!;
    private startTextSegmentAddress: word = Memory.word(0x00400000);
    private startDataSegmentAddress: word = Memory.word(0x10010000);
    private currentTextSegmentAddress: number = this.startTextSegmentAddress;
    private currentDataSegmentAddress: number = this.startDataSegmentAddress;

    assemble(program: string, memory: Memory, registers: Registers) {
        const lines = program.split('\n');
        for (let i = 0; i < lines.length; i++) {
            this.assembleLine(i+1, lines[i], memory, registers);
        }
        return this.assembledLines;
    }

    private assembleLine(lineNumber: number, line: string, memory: Memory, registers: Registers) {
        const parts = line.split('#')[0].trim().replace(/,/g, '').split(/\s+/);
        if (parts.length === 0 || parts[0] === '') {
            return;
        }
        const directive = Directives.get(parts[0]);
        if (directive) {
            if (directive.segment) {
                this.currentDirective = directive!;
            } else {
                directive.assemble!(line, memory, registers);
            }
        } else {
            this.assembleInstruction(lineNumber, parts, memory, registers);
        }
    }

    private assembleInstruction(lineNumber: number, lineParts: string[], memory: Memory, registers: Registers) {
        const instruction = InstructionSet.get(lineParts[0]);
        if (instruction) {
            switch(instruction.format) {
                case 'R':
                    if (lineParts.length !== 4) throw new Error(``);
                    this.assembleR(lineNumber, lineParts, instruction, memory, registers);
                    return;
                case 'I':
                    if (lineParts.length !== 4) throw new Error(``);
                    this.assembleI(lineNumber, lineParts, instruction, memory, registers);
                    return;
                case 'J':
                    if (lineParts.length !== 2) throw new Error(``);
                    this.assembleJ(lineNumber, lineParts, instruction, memory);
                    return;
                default:
                    throw new Error(``);
            }
        } else {
            // TO-DO: gestione labels
        }
    }

    private assembleR(lineNumber: number, lineParts: string[], instruction: Instruction, memory: Memory, registers: Registers) {
        if (!registers.getByName(lineParts[1])) throw new Error(``);
        const rd: Register = registers.getByName(lineParts[1])!;
        if (!registers.getByName(lineParts[2])) throw new Error(``);
        const rs: Register = registers.getByName(lineParts[2])!;
        if (!registers.getByName(lineParts[3])) throw new Error(``);
        const rt: Register = registers.getByName(lineParts[3])!;
        const binary: word = (instruction.opcode! << 26) | (rs.number! << 21) | (rt.number! << 16) | (rd.number! << 11) | (0x00 << 6) | instruction.funct!;
        const assembledLine: AssembledLine = {
            sourceLine: lineNumber,
            basicInstruction: lineParts.join(' '),
            binaryInstruction: binary,
            address: this.currentTextSegmentAddress
        };
        this.assembledLines.push(assembledLine);
        this.storeInstruction(binary, memory);
    }

    private assembleI(lineNumber: number, lineParts: string[], instruction: Instruction, memory: Memory, registers: Registers) {
        if (!registers.getByName(lineParts[1])) throw new Error(``);
        const rt: Register = registers.getByName(lineParts[1])!;
        if (!registers.getByName(lineParts[2])) throw new Error(``);
        const rs: Register = registers.getByName(lineParts[2])!;
        const immediate: word = Memory.word(Number(lineParts[3]));
        const binary: word = (instruction.opcode! << 26) | (rs.number! << 21) | (rt.number! << 16) | immediate;
        const assembledLine: AssembledLine = {
            sourceLine: lineNumber,
            basicInstruction: lineParts.join(' '),
            binaryInstruction: binary,
            address: this.currentTextSegmentAddress
        };
        this.assembledLines.push(assembledLine);
        this.storeInstruction(binary, memory);
    }

    private assembleJ(lineNumber: number, lineParts: string[], instruction: Instruction, memory: Memory) {
        const address: word = Memory.word(Number(lineParts[1]));
        const binary: word = (instruction.opcode! << 26) | address;
        const assembledLine: AssembledLine = {
            sourceLine: lineNumber,
            basicInstruction: lineParts.join(' '),
            binaryInstruction: binary,
            address: this.currentTextSegmentAddress
        };
        this.assembledLines.push(assembledLine);
        this.storeInstruction(binary, memory);
    }

    private storeInstruction(instruction: word, memory: Memory) {
        memory.store(this.currentTextSegmentAddress, instruction);
        this.currentTextSegmentAddress += 4;
    }


    /*private printInConsole() {
        console.log("- ASSEMBLED LINES -");
        console.log("Line\tInstruction\t\t\tAddress\t\tBinary");
        for (const line of this.assembledLines) {
            const hexAddress = "0x" + line.address.toString(16).padStart(8, '0');
            const hexInstruction = "0x" + line.binaryInstruction.toString(16).padStart(8, '0');
            console.log(`${line.sourceLine}\t\t${line.basicInstruction}\t\t${hexAddress}\t${hexInstruction}`);
        }
        console.log("-");
    }*/

}