import {Binary, Utils} from "./Utils.js";
import {CPU} from "./CPU.js";
import {Assembler} from "./Assembler.js";
import {VirtualMachine} from "./VirtualMachine.js";
import {getFromStorage} from "../utils.js";
import {Registers} from "./Registers.js";

export abstract class Instruction {

    symbol: string;
    params: string;
    format: string;
    opcode: Binary;
    funct: Binary | undefined;

    constructor(symbol: string, params: string, format: string, opcode: Binary, funct: Binary | undefined) {
        this.symbol = symbol;
        this.params = params;
        this.format = format;
        this.opcode = opcode;
        this.funct = funct;
    }

    abstract execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine | undefined): void;

    basic(params: { [key: string]: Binary }, registers: Registers): string {

        const registersFormat = getFromStorage("local", "settings").colsFormats['registers-name-format'];

        const paramsNames = this.params.split(',').map(p => p.trim());
        const paramValues: string[] = [];

        for (const name of paramsNames) {
            if (name.includes('(') && name.includes(')')) {
                const offsetValue = params['immediate']?.getValue() || 0;
                const rsValue = params['rs']?.getValue();
                paramValues.push(`${offsetValue}(${registers.getRegisterFormat(rsValue, registersFormat, registers)})`);
            } else if (['rs', 'rt', 'rd'].includes(name)) {
                const regValue = params[name]?.getValue();
                paramValues.push(`${registers.getRegisterFormat(regValue, registersFormat, registers)}`);
            } else if (name === 'immediate' || name === 'offset') {
                const immediateValue = params['immediate']?.getValue();
                paramValues.push(immediateValue !== undefined ? immediateValue.toString() : '0');
            } else if (name === 'target') {
                const targetValue = params[name]?.getValue();
                paramValues.push(targetValue !== undefined ? targetValue.toString() : '0');
            } else if (name === 'SYSCALL' || name === 'BREAK') {
                return this.symbol.toLowerCase();
            } else if (name === 'sa') {
                const shamtValue = params['shamt']?.getValue();
                paramValues.push(shamtValue !== undefined ? shamtValue.toString() : 'undefined');
            } else {
                console.error("Param to handle: " + name);
                const paramValue = params[name]?.getValue();
                paramValues.push(paramValue !== undefined ? paramValue.toString() : 'undefined');
            }
        }

        return `${this.symbol.toLowerCase()} ${paramValues.join(', ')}`;
    }

}

export abstract class PseudoInstruction {

    symbol: string;
    params: string[];

    constructor(symbol: string, params: string) {
        this.symbol = symbol;
        this.params = params.split(',').map(param => param.trim());
    }

    mapParams(tokens: string[]): { [key: string]: string } {
        const paramMap: { [key: string]: string } = {};

        for (let i = 0; i < this.params.length; i++) {
            paramMap[this.params[i]] = tokens[i + 1];
        }

        return paramMap;
    }

    abstract expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][];
}

export class Instructions {

    instructions: Instruction[] = [];
    pseudoInstructions: PseudoInstruction[] = [];

    constructor() {
        this.initInstructions();
        this.initPseudoInstructions();
    }

    getBySymbol(symbol: string): Instruction | undefined {
        for (const instruction of this.instructions) {
            if (instruction.symbol.toLowerCase() === symbol.toLowerCase()) {
                return instruction;
            }
        }
    }

    getPseudoBySymbol(symbol: string): PseudoInstruction | undefined {
        for (const pseudo of this.pseudoInstructions) {
            if (pseudo.symbol.toLowerCase() === symbol.toLowerCase()) {
                return pseudo;
            }
        }
    }

    initInstructions() {

        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SLL', 'rd, rt, sa', 'R',
                    new Binary(0b000000, 6), new Binary(0b000000, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rd =  registers[params.rd!.getValue()].binary;
                const rt =  registers[params.rt!.getValue()].binary;
                const sa = params.shamt!;

                rd.set(rt.getValue() << sa.getValue());

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SRL', 'rd, rt, sa', 'R',
                    new Binary(0b000000, 6), new Binary(0b000010, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SRA', 'rd, rt, sa', 'R',
                    new Binary(0b000000, 6), new Binary(0b000011, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SLLV', 'rd, rt, rs', 'R',
                    new Binary(0b000000, 6), new Binary(0b000100, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SRLV', 'rd, rt, rs', 'R',
                    new Binary(0b000000, 6), new Binary(0b000110, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SRAV', 'rd, rt, rs', 'R',
                    new Binary(0b000000, 6), new Binary(0b000111, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'JR', 'rs', 'R',
                    new Binary(0b000000, 6), new Binary(0b001000, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rs = registers[params.rs.getValue()].binary.getValue();

                cpu.pc.set(rs);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'JALR', 'rd, rs', 'R',
                    new Binary(0b000000, 6), new Binary(0b001001, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SYSCALL', 'SYSCALL', 'R',
                    new Binary(0b000000, 6), new Binary(0b001100, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const v0 = registers[2].binary;

                const syscall = cpu.syscallsSet.get(v0.getValue());
                if (!syscall) {
                    throw new Error(`Unknown syscall: ${v0.getValue()}`);
                }

                await syscall.execute(cpu, {}, vm);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'BREAK', 'BREAK', 'R',
                    new Binary(0b000000, 6), new Binary(0b001101, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'MFHI', 'rd', 'R',
                    new Binary(0b000000, 6), new Binary(0b010000, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'MTHI', 'rs', 'R',
                    new Binary(0b000000, 6), new Binary(0b010001, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'MFLO', 'rd', 'R',
                    new Binary(0b000000, 6), new Binary(0b010010, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rd =  registers[params.rd!.getValue()].binary;

                rd.set(cpu.lo.getValue());

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'MTLO', 'rs', 'R',
                    new Binary(0b000000, 6), new Binary(0b010011, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DSLLV', 'rd, rt, rs', 'R',
                    new Binary(0b000000, 6), new Binary(0b010100, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DSRAV', 'rd, rt, rs', 'R',
                    new Binary(0b000000, 6), new Binary(0b010111, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'MULT', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b011000, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rs = registers[params.rs!.getValue()].binary;
                const rt = registers[params.rt!.getValue()].binary;

                const rsValue = rs.getValue();
                const rtValue = rt.getValue();
                const result = BigInt(rsValue) * BigInt(rtValue);

                cpu.lo.set(Number(result & BigInt(0xFFFFFFFF)));
                cpu.hi.set(Number((result >> BigInt(32)) & BigInt(0xFFFFFFFF)));

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'MULTU', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b011001, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DIV', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b011010, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rs = registers[params.rs.getValue()].binary;
                const rt = registers[params.rt.getValue()].binary;

                const rsValue = rs.getValue();
                const rtValue = rt.getValue();

                if (rtValue === 0) {
                    console.warn('DIV instruction: Division by zero. Result undefined.');
                    return;
                }

                const quotient = Math.floor(rsValue / rtValue);
                const remainder = rsValue % rtValue;

                cpu.lo.set(quotient);
                cpu.hi.set(remainder);

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DIVU', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b011011, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DMULT', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b011100, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DMULTU', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b011101, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DDIV', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b011110, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DDIVU', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b011111, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'ADD', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b100000, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                const registers = cpu.getRegisters();
                const rd = registers[params.rd!.getValue()].binary;
                const rs = registers[params.rs!.getValue()].binary;
                const rt = registers[params.rt!.getValue()].binary;

                const rsValue = rs.getValue();
                const rtValue = rt.getValue();
                const result = rsValue + rtValue;

                const overflow = (
                    ((rsValue > 0 && rtValue > 0) && result < 0) ||
                    ((rsValue < 0 && rtValue < 0) && result > 0)
                );

                if (overflow) {
                    throw new Error('Integer Overflow');
                }

                rd.set(result);

                cpu.pc.set(cpu.pc.getValue() + 4);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'ADDU', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b100001, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rd = registers[params.rd!.getValue()].binary;
                const rs =  registers[params.rs!.getValue()].binary;
                const rt =  registers[params.rt!.getValue()].binary;

                rd.set(rs.getValue() + rt.getValue());

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SUB', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b100010, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                const registers = cpu.getRegisters();
                const rd = registers[params.rd!.getValue()].binary;
                const rs = registers[params.rs!.getValue()].binary;
                const rt = registers[params.rt!.getValue()].binary;

                const rsValue = rs.getValue();
                const rtValue = rt.getValue();
                const result = rsValue - rtValue;

                const overflow = (
                    ((rsValue > 0 && rtValue < 0) && result < 0) ||
                    ((rsValue < 0 && rtValue > 0) && result > 0)
                );

                if (overflow) {
                    throw new Error('Integer Overflow');
                }

                rd.set(result);

                cpu.pc.set(cpu.pc.getValue() + 4);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SUBU', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b100011, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'AND', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b100100, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'OR', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b100101, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'XOR', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b100110, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'NOR', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b100111, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SLT', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b101010, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SLTU', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b101011, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DADD', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b101100, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DADDU', 'rd, rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b101101, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'TGE', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b110000, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'TGEU', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b110001, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'TLT', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b110010, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'TLTU', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b110011, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'TEQ', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b110100, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'TNE', 'rs, rt', 'R',
                    new Binary(0b000000, 6), new Binary(0b110110, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DSLL', 'rd, rt, sa', 'R',
                    new Binary(0b000000, 6), new Binary(0b111000, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DSRL', 'rd, rt, sa', 'R',
                    new Binary(0b000000, 6), new Binary(0b111010, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DSRA', 'rd, rt, sa', 'R',
                    new Binary(0b000000, 6), new Binary(0b111011, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DSLL32', 'rd, rt, sa', 'R',
                    new Binary(0b000000, 6), new Binary(0b111100, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DSRL32', 'rd, rt, sa', 'R',
                    new Binary(0b000000, 6), new Binary(0b111110, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DSRA32', 'rd, rt, sa', 'R',
                    new Binary(0b000000, 6), new Binary(0b111111, 6)
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'J', 'target', 'J',
                    new Binary(0b000010, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'JAL', 'target', 'J',
                    new Binary(0b000011, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const target = params.target.getValue();

                registers[31].binary.set(cpu.pc.getValue() + 4);

                const newPC = (cpu.pc.getValue() & 0xF0000000) | (target << 2);
                cpu.pc.set(newPC);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'BEQ', 'rs, rt, offset', 'I',
                    new Binary(0b000100, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'BNE', 'rs, rt, offset', 'I',
                    new Binary(0b000101, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                const registers = cpu.getRegisters();
                const rs = registers[params.rs!.getValue()].binary.getValue();
                const rt = registers[params.rt!.getValue()].binary.getValue();
                const offset = Utils.fromSigned(params.immediate!.getValue(), 16) << 2;

                if (rs !== rt) {
                    cpu.pc.set(cpu.pc.getValue() + 4 + offset);
                } else {
                    cpu.pc.set(cpu.pc.getValue() + 4);
                }
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'BLEZ', 'rs, offset', 'I',
                    new Binary(0b000110, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'BGTZ', 'rs, offset', 'I',
                    new Binary(0b000111, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rs =  registers[params.rs!.getValue()].binary;
                const offset = Utils.fromSigned(params.immediate!.getValue(), 18) << 2;

                cpu.pc.set(cpu.pc.getValue() + 4);

                if (rs.getValue() > 0) {
                    cpu.pc.set(cpu.pc.getValue() + offset);
                }

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'ADDI', 'rt, rs, immediate', 'I',
                    new Binary(0b001000, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                const registers = cpu.getRegisters();
                const rt = registers[params.rt!.getValue()].binary;
                const rs = registers[params.rs!.getValue()].binary;
                const immediate = params.immediate!.getValue();

                const rsValue = rs.getValue();
                const result = rsValue + immediate;

                const overflow = (
                    (rsValue >= 0 && immediate >= 0 && result < 0) ||
                    (rsValue < 0 && immediate < 0 && result >= 0)
                );

                if (overflow) {
                    throw new Error(`Arithmetic Overflow in ADDI instruction`);
                }

                rt.set(result);
                cpu.pc.set(cpu.pc.getValue() + 4);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'ADDIU', 'rt, rs, immediate', 'I',
                    new Binary(0b001001, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rt = registers[params.rt!.getValue()].binary;
                const rs =  registers[params.rs!.getValue()].binary;
                const immediate = params.immediate!.getValue();

                rt.set(rs.getValue() + immediate);

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SLTI', 'rt, rs, immediate', 'I',
                    new Binary(0b001010, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SLTIU', 'rt, rs, immediate', 'I',
                    new Binary(0b001011, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'ANDI', 'rt, rs, immediate', 'I',
                    new Binary(0b001100, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'ORI', 'rt, rs, immediate', 'I',
                    new Binary(0b001101, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rt = registers[params.rt!.getValue()].binary;
                const rs =  registers[params.rs!.getValue()].binary;
                const immediate = params.immediate!.getValue();

                rt.set(rs.getValue() | immediate);

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'XORI', 'rt, rs, immediate', 'I',
                    new Binary(0b001110, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LUI', 'rt, immediate', 'I',
                    new Binary(0b001111, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rt = registers[params.rt!.getValue()].binary;
                const immediate = params.immediate!.getValue();

                rt.set(immediate << 16);

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'COP0', 'cop_fun', 'I',
                    new Binary(0b010000, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'COP1', 'cop_fun', 'I',
                    new Binary(0b010001, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'COP2', 'cop_fun', 'I',
                    new Binary(0b010010, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'COP3', 'cop_fun', 'I',
                    new Binary(0b010011, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'BEQL', 'rs, rt, offset', 'I',
                    new Binary(0b010100, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'BNEL', 'rs, rt, offset', 'I',
                    new Binary(0b010101, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'BLEZL', 'rs, offset', 'I',
                    new Binary(0b010110, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'BGTZL', 'rs, offset', 'I',
                    new Binary(0b010111, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DADDI', 'rt, rs, immediate', 'I',
                    new Binary(0b011000, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'DADDIU', 'rt, rs, immediate', 'I',
                    new Binary(0b011001, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LB', 'rt, offset(base)', 'I',
                    new Binary(0b100000, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LH', 'rt, offset(base)', 'I',
                    new Binary(0b100001, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LWL', 'rt, offset(base)', 'I',
                    new Binary(0b100010, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LW', 'rt, offset(base)', 'I',
                    new Binary(0b100011, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rt = registers[params.rt!.getValue()].binary;
                const rs =  registers[params.rs!.getValue()].binary;
                const immediate = params.immediate!.getValue();

                const address = rs.getValue() + immediate;
                const value = cpu.memory.loadWord(new Binary(address), true);
                rt.set(value.getValue());

                cpu.pc.set(cpu.pc.getValue() + 4);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LBU', 'rt, offset(base)', 'I',
                    new Binary(0b100100, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LHU', 'rt, offset(base)', 'I',
                    new Binary(0b100101, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LWR', 'rt, offset(base)', 'I',
                    new Binary(0b100110, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SB', 'rt, offset(base)', 'I',
                    new Binary(0b101000, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SH', 'rt, offset(base)', 'I',
                    new Binary(0b101001, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SWL', 'rt, offset(base)', 'I',
                    new Binary(0b101010, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SW', 'rt, offset(base)', 'I',
                    new Binary(0b101011, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                const registers = cpu.getRegisters();
                const rt = registers[params.rt!.getValue()].binary;
                const rs =  registers[params.rs!.getValue()].binary;
                const immediate = params.immediate!.getValue();

                const address = rs.getValue() + immediate;
                cpu.memory.storeWord(new Binary(address), rt);

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SWR', 'rt, offset(base)', 'I',
                    new Binary(0b101110, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LWC1', 'rt, offset(base)', 'I',
                    new Binary(0b110001, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LWC2', 'rt, offset(base)', 'I',
                    new Binary(0b110010, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LWC3', 'rt, offset(base)', 'I',
                    new Binary(0b110011, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LDC1', 'rt, offset(base)', 'I',
                    new Binary(0b110101, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'LDC2', 'rt, offset(base)', 'I',
                    new Binary(0b110110, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SC', 'rt, offset(base)', 'I',
                    new Binary(0b111000, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SWC1', 'rt, offset(base)', 'I',
                    new Binary(0b111001, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SWC2', 'rt, offset(base)', 'I',
                    new Binary(0b111010, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SWC3', 'rt, offset(base)', 'I',
                    new Binary(0b111011, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SDC1', 'rt, offset(base)', 'I',
                    new Binary(0b111101, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());
        this.instructions.push(new class extends Instruction {
            constructor() {
                super(
                    'SDC2', 'rt, offset(base)', 'I',
                    new Binary(0b111110, 6), undefined,
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {
                throw new Error(`${this.symbol} not implemented yet`);
            }
        }());

    }

    initPseudoInstructions() {

        this.pseudoInstructions.push(new class extends PseudoInstruction {
            constructor() {
                super('MOVE', 'rd, rs');
            }
            expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][] {
                const params = this.mapParams(tokens);
                return [
                    ['addu', params['rd'], '$zero', params['rs']]
                ];
            }
        }());
        this.pseudoInstructions.push(new class extends PseudoInstruction {
            constructor() {
                super('LI', 'rd, immediate');
            }
            expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][] {
                const params = this.mapParams(tokens);
                const immediate = parseInt(params['immediate']);

                if (immediate < -32768 || immediate > 32767) {

                    const upper = Utils.fromSigned((immediate >>> 16) & 0xFFFF, 16);
                    const lower = immediate & 0xFFFF;

                    return [
                        ['lui', '$at', `${upper}`],
                        ['ori', params['rd'], '$at', `${lower}`]
                    ];

                } else {

                    return [
                        ['addiu', params['rd'], '$zero', params['immediate']]
                    ];

                }

            }
        }());
        this.pseudoInstructions.push(new class extends PseudoInstruction {
            constructor() {
                super('LA', 'rd, label');
            }
            expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][] {
                const params = this.mapParams(tokens);
                const label = params['label'];
                const labelAddress = labels.get(label)?.getValue();
                if (labelAddress === undefined) {
                    throw new Error(`Label "${label}" not found.`);
                }

                const upper = Utils.fromSigned((labelAddress >>> 16) & 0xFFFF, 16);
                const lower = labelAddress & 0xFFFF;

                return [
                    ['lui', '$at', `${upper}`],
                    ['ori', params['rd'], '$at', `${lower}`]
                ];

            }
        }());
        this.pseudoInstructions.push(new class extends PseudoInstruction {
            constructor() {
                super('BLT', 'rs, rt, label');
            }
            expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][] {
                const params = this.mapParams(tokens);
                return [];
            }
        }());
        this.pseudoInstructions.push(new class extends PseudoInstruction {
            constructor() {
                super('BLE', 'rs, rt, label');
            }

            expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][] {
                const params = this.mapParams(tokens);
                return [];
            }
        }());
        this.pseudoInstructions.push(new class extends PseudoInstruction {
            constructor() {
                super('BGT', 'rs, rt, label');
            }

            expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][] {
                const params = this.mapParams(tokens);
                return [];
            }
        }());
        this.pseudoInstructions.push(new class extends PseudoInstruction {
            constructor() {
                super('BGE', 'rs, rt, label');
            }

            expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][] {
                const params = this.mapParams(tokens);
                return [];
            }
        }());
        this.pseudoInstructions.push(new class extends PseudoInstruction {
            constructor() {
                super('MUL', 'rd, rs, rt');
            }

            expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][] {
                const params = this.mapParams(tokens);
                return [
                    ['mult', params['rs'], params['rt']],
                    ['mflo', params['rd']]
                ];
            }
        }());

        this.pseudoInstructions.push(new class extends PseudoInstruction {
            constructor() {
                super('DIV', 'rd, rs, rt');
            }

            expand(assebler: Assembler, tokens: string[], globals: Map<string, Binary | undefined>, labels: Map<string, Binary | undefined>, address: Binary): string[][] {
                const params = this.mapParams(tokens);
                return [
                    ['bne', params['rt'], '$zero', '1'],
                    ['break'],
                    ['div', params['rs'], params['rt']],
                    ['mflo', params['rd']]
                ];
            }
        }());

    }

}