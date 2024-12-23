var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Registers } from "./Registers.js";
import { Memory } from "./Memory.js";
import { Binary } from "./Utils.js";
import { Instructions } from "./Instructions.js";
import { I_Format, J_Format, R_Format } from "./Formats.js";
import { Syscalls } from "./Syscalls.js";
export class CPU {
    constructor() {
        this.textSegmentStart = new Binary(0x00400000);
        this.textSegmentEnd = new Binary(this.textSegmentStart.getValue());
        this.dataSegmentStart = new Binary(0x10010000);
        this.dataSegmentEnd = new Binary(this.dataSegmentStart.getValue());
        this.registers = new Registers([
            "$zero",
            "$at",
            "$v0", "$v1",
            "$a0", "$a1", "$a2", "$a3",
            "$t0", "$t1", "$t2", "$t3", "$t4", "$t5", "$t6", "$t7",
            "$s0", "$s1", "$s2", "$s3", "$s4", "$s5", "$s6", "$s7",
            "$t8", "$t9",
            "$k0", "$k1",
            "$gp",
            "$sp",
            "$fp",
            "$ra"
        ]);
        this.pc = new Binary(this.textSegmentStart.getValue());
        this.lo = new Binary();
        this.hi = new Binary();
        this.instructionsSet = new Instructions();
        this.syscallsSet = new Syscalls();
        this.formats = new Map();
        this.memory = new Memory();
        this.halted = false;
        this.registers.get("$gp").binary = new Binary(0x10008000);
        this.registers.get("$sp").binary = new Binary(0x7fffeffc);
        this.formats.set('R', new R_Format());
        this.formats.set('I', new I_Format());
        this.formats.set('J', new J_Format());
    }
    storeByte(address, value) {
        this.memory.storeByte(address, value);
    }
    storeWord(address, value) {
        this.memory.storeWord(address, value);
    }
    loadByte(address) {
        return this.memory.loadByte(address);
    }
    loadWord(address) {
        return this.memory.loadWord(address);
    }
    decode(instructionCode) {
        var _a;
        console.log();
        const opcode = new Binary(instructionCode.getBits(31, 26).getValue(), 6);
        let funct = undefined;
        if (opcode.getValue() === 0) {
            funct = new Binary(instructionCode.getBits(5, 0).getValue(), 6);
        }
        let foundInstruction = undefined;
        for (const instruction of this.instructionsSet.instructions) {
            if (instruction.opcode.getValue() === opcode.getValue()) {
                if (funct) {
                    if (((_a = instruction.funct) === null || _a === void 0 ? void 0 : _a.getValue()) === funct.getValue()) {
                        foundInstruction = instruction;
                        break;
                    }
                }
                else {
                    if (!instruction.funct) {
                        foundInstruction = instruction;
                        break;
                    }
                }
            }
        }
        if (foundInstruction) {
            const format = this.getFormat(foundInstruction.format);
            if (format) {
                let params = format.disassemble(foundInstruction, instructionCode);
                const basic = foundInstruction.basic(params);
                return { instruction: foundInstruction, params, basic };
            }
        }
        return undefined;
    }
    execute(vm) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pc <= this.textSegmentEnd) {
                const instructionCode = this.memory.loadWord(this.pc);
                const decodedInstruction = this.decode(instructionCode);
                if (decodedInstruction) {
                    const instruction = decodedInstruction.instruction;
                    if (instruction) {
                        const oldRegisters = this.registers.copy();
                        yield instruction.execute(this, decodedInstruction.params, vm);
                        let changedRegister = undefined;
                        for (let i = 0; i < this.registers.registers.length; i++) {
                            if (!this.registers.registers[i].binary.equals(oldRegisters.registers[i].binary)) {
                                changedRegister = this.registers.registers[i].name;
                                break;
                            }
                        }
                        vm.lastChangedRegister = changedRegister;
                    }
                }
            }
            else {
                this.halt();
            }
        });
    }
    getFormat(format) {
        return this.formats.get(format);
    }
    resume() {
        this.halted = false;
    }
    halt() {
        this.halted = true;
    }
    isHalted() {
        return this.halted;
    }
    reset() {
        this.registers.reset();
        this.memory.reset();
        this.textSegmentStart = new Binary(0x00400000);
        this.textSegmentEnd = new Binary(this.textSegmentStart.getValue());
        this.dataSegmentStart = new Binary(0x10010000);
        this.dataSegmentEnd = new Binary(this.dataSegmentStart.getValue());
        this.registers.get("$gp").binary = new Binary(0x10008000);
        this.registers.get("$sp").binary = new Binary(0x7fffeffc);
        this.pc = new Binary(this.textSegmentStart.getValue());
        this.lo = new Binary();
        this.hi = new Binary();
        this.halted = false;
    }
    getRegisters() {
        return this.registers.registers;
    }
    getMemory() {
        return this.memory.get();
    }
}
