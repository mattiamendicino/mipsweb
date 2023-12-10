import {Memory, word} from "./Memory.js";
import {register, Registers} from "./Registers.js";
import {directive, Directives} from "./Directives.js";
import {instruction, InstructionSet} from "./InstructionSet.js";

export type assembledLine = {
    sourceLine: number,
    basicInstruction: string,
    binaryInstruction: word,
    address: word
}

export class Assembler {

    private assembledLines: assembledLine[] = [];
    private currentDirective: directive = Directives.get(".text")!;
    private startTextSegmentAddress: word = Memory.word(0x00400000);
    private startDataSegmentAddress: word = Memory.word(0x10010000);
    private currentTextSegmentAddress: number = this.startTextSegmentAddress;
    private currentDataSegmentAddress: number = this.startDataSegmentAddress;

    assemble(program: string, memory: Memory, registers: Registers) {
        const lines = program.split('\n');
        for (let i = 0; i < lines.length; i++) {
            this.assembleLine(i+1, lines[i], memory, registers);
        }
        memory.store(registers.getByName("$gp")!.value, 0);
        memory.store(registers.getByName("$sp")!.value, 0);
        return this.assembledLines;
    }

    private assembleLine(lineNumber: number, line: string, memory: Memory, registers: Registers) {
        const parts = line.split('#')[0].trim().replace(/,/g, '').split(/\s+/);
        if (parts.length === 0 || parts[0] === '') {
            return;
        }
        let directive = Directives.get(parts[0]);
        if (directive) {
            this.currentDirective = directive;
        } else {
            directive = Directives.get(parts[1]);
            if (directive) {
                this.currentDirective = directive;
            }
        }
        this.currentDirective.assemble(lineNumber, parts, memory, registers, this);
    }

    assembleInstruction(lineNumber: number, lineParts: string[], memory: Memory, registers: Registers) {
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

    private assembleR(lineNumber: number, lineParts: string[], instruction: instruction, memory: Memory, registers: Registers) {
        if (!registers.getByName(lineParts[1])) throw new Error(``);
        const rd: register = registers.getByName(lineParts[1])!;
        if (!registers.getByName(lineParts[2])) throw new Error(``);
        const rs: register = registers.getByName(lineParts[2])!;
        if (!registers.getByName(lineParts[3])) throw new Error(``);
        const rt: register = registers.getByName(lineParts[3])!;
        const binary: word = (instruction.opcode! << 26) | (rs.number! << 21) | (rt.number! << 16) | (rd.number! << 11) | (0x00 << 6) | instruction.funct!;
        const assembledLine: assembledLine = {
            sourceLine: lineNumber,
            basicInstruction: lineParts.join(' '),
            binaryInstruction: binary,
            address: this.currentTextSegmentAddress
        };
        this.assembledLines.push(assembledLine);
        this.storeInstruction(binary, memory);
    }

    private assembleI(lineNumber: number, lineParts: string[], instruction: instruction, memory: Memory, registers: Registers) {
        if (!registers.getByName(lineParts[1])) throw new Error(``);
        const rt: register = registers.getByName(lineParts[1])!;
        if (!registers.getByName(lineParts[2])) throw new Error(``);
        const rs: register = registers.getByName(lineParts[2])!;
        const immediate: word = Memory.word(Number(lineParts[3]));
        const binary: word = (instruction.opcode! << 26) | (rs.number! << 21) | (rt.number! << 16) | immediate;
        const assembledLine: assembledLine = {
            sourceLine: lineNumber,
            basicInstruction: lineParts.join(' '),
            binaryInstruction: binary,
            address: this.currentTextSegmentAddress
        };
        this.assembledLines.push(assembledLine);
        this.storeInstruction(binary, memory);
    }

    private assembleJ(lineNumber: number, lineParts: string[], instruction: instruction, memory: Memory) {
        const address: word = Memory.word(Number(lineParts[1]));
        const binary: word = (instruction.opcode! << 26) | address;
        const assembledLine: assembledLine = {
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

    private storeData(data: word, memory: Memory) {
        memory.store(this.currentDataSegmentAddress, data);
        this.currentDataSegmentAddress += 4;
    }

    assembleData(lineNumber: number, parts: string[], memory: Memory, registers: Registers) {
        if (parts.length > 1) {
            for (let i = 0; i < parts.length; i++) {
                this.assembleData(lineNumber, [parts[i]], memory, registers);
            }
        } else if (parts.length === 1) {
            const binary: word = this.toBinary(parts[0]);
            this.storeData(Memory.word(binary), memory);
        }
    }

    private toBinary(data: string): word {
        if (data.substring(0, 2) === "0x") {
            return Memory.word(Number(data));
        } if ((data.charAt(0) === "'") && ((data.charAt(data.length - 1) === "'"))) {
            if (data.substring(1, data.length - 1).length > 1) throw new Error(``);
            return Memory.word(data.charCodeAt(1));
        } else {
            const number = Number(data);
            if (isNaN(number)) throw new Error(``);
            return Memory.word(number);
        }
    }
}