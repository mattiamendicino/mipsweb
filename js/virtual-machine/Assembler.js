import { Memory } from "./Memory.js";
import { Directives } from "./Directives.js";
import { InstructionSet } from "./InstructionSet.js";
export class Assembler {
    constructor() {
        this.assembledLines = [];
        this.currentDirective = Directives.get(".text");
        this.startTextSegmentAddress = Memory.word(0x00400000);
        this.startDataSegmentAddress = Memory.word(0x10010000);
        this.currentTextSegmentAddress = this.startTextSegmentAddress;
        this.currentDataSegmentAddress = this.startDataSegmentAddress;
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
    assemble(program, memory, registers) {
        const lines = program.split('\n');
        for (let i = 0; i < lines.length; i++) {
            this.assembleLine(i + 1, lines[i], memory, registers);
        }
        return this.assembledLines;
    }
    assembleLine(lineNumber, line, memory, registers) {
        const parts = line.split('#')[0].trim().replace(/,/g, '').split(/\s+/);
        if (parts.length === 0 || parts[0] === '') {
            return;
        }
        const directive = Directives.get(parts[0]);
        if (directive) {
            if (directive.segment) {
                this.currentDirective = directive;
            }
            else {
                directive.assemble(line, memory, registers);
            }
        }
        else {
            this.assembleInstruction(lineNumber, parts, memory, registers);
        }
    }
    assembleInstruction(lineNumber, lineParts, memory, registers) {
        const instruction = InstructionSet.get(lineParts[0]);
        if (instruction) {
            switch (instruction.format) {
                case 'R':
                    if (lineParts.length !== 4)
                        throw new Error(``);
                    this.assembleR(lineNumber, lineParts, instruction, memory, registers);
                    return;
                case 'I':
                    if (lineParts.length !== 4)
                        throw new Error(``);
                    this.assembleI(lineNumber, lineParts, instruction, memory, registers);
                    return;
                case 'J':
                    if (lineParts.length !== 2)
                        throw new Error(``);
                    this.assembleJ(lineNumber, lineParts, instruction, memory);
                    return;
                default:
                    throw new Error(``);
            }
        }
        else {
            // TO-DO: gestione labels
        }
    }
    assembleR(lineNumber, lineParts, instruction, memory, registers) {
        if (!registers.getByName(lineParts[1]))
            throw new Error(``);
        const rd = registers.getByName(lineParts[1]);
        if (!registers.getByName(lineParts[2]))
            throw new Error(``);
        const rs = registers.getByName(lineParts[2]);
        if (!registers.getByName(lineParts[3]))
            throw new Error(``);
        const rt = registers.getByName(lineParts[3]);
        const binary = (instruction.opcode << 26) | (rs.number << 21) | (rt.number << 16) | (rd.number << 11) | (0x00 << 6) | instruction.funct;
        const assembledLine = {
            sourceLine: lineNumber,
            basicInstruction: lineParts.join(' '),
            binaryInstruction: binary,
            address: this.currentTextSegmentAddress
        };
        this.assembledLines.push(assembledLine);
        this.storeInstruction(binary, memory);
    }
    assembleI(lineNumber, lineParts, instruction, memory, registers) {
        if (!registers.getByName(lineParts[1]))
            throw new Error(``);
        const rt = registers.getByName(lineParts[1]);
        if (!registers.getByName(lineParts[2]))
            throw new Error(``);
        const rs = registers.getByName(lineParts[2]);
        const immediate = Memory.word(Number(lineParts[3]));
        const binary = (instruction.opcode << 26) | (rs.number << 21) | (rt.number << 16) | immediate;
        const assembledLine = {
            sourceLine: lineNumber,
            basicInstruction: lineParts.join(' '),
            binaryInstruction: binary,
            address: this.currentTextSegmentAddress
        };
        this.assembledLines.push(assembledLine);
        this.storeInstruction(binary, memory);
    }
    assembleJ(lineNumber, lineParts, instruction, memory) {
        const address = Memory.word(Number(lineParts[1]));
        const binary = (instruction.opcode << 26) | address;
        const assembledLine = {
            sourceLine: lineNumber,
            basicInstruction: lineParts.join(' '),
            binaryInstruction: binary,
            address: this.currentTextSegmentAddress
        };
        this.assembledLines.push(assembledLine);
        this.storeInstruction(binary, memory);
    }
    storeInstruction(instruction, memory) {
        memory.store(this.currentTextSegmentAddress, instruction);
        this.currentTextSegmentAddress += 4;
    }
}
