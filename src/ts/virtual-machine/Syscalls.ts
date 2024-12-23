import {CPU} from "./CPU";
import {Binary} from "./Utils.js";
import {VirtualMachine} from "./VirtualMachine.js";
import {renderApp} from "../app.js";

export abstract class Syscall {

    name: string;
    code: number;

    constructor(name: string, code: number) {
        this.name = name;
        this.code = code;
    }

    abstract execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void;

}

export class Syscalls {

    syscalls: Syscall[] = [];

    constructor() {
        this.initSyscalls();
    }

    get(code: number) {
        return this.syscalls.find(syscall => syscall.code === code);
    }

    initSyscalls() {

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "PRINT_INT", 1
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {

                const address = cpu.registers.get('$a0');
                if (address) {
                    const int = address.binary.getValue();
                    vm.console.addLine(int.toString(), "success");
                }

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "PRINT_FLOAT", 2
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "PRINT_DOUBLE", 3
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "PRINT_STRING", 4
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {

                const address = cpu.registers.get('$a0');
                if (address) {
                    const string = vm.cpu.memory.getString(address.binary);
                    vm.console.addLine(string, "success");
                }

                cpu.pc.set(cpu.pc.getValue() + 4);

            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "READ_INT", 5
                );
            }
            async execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): Promise<void> {

                vm.cpu.halt();
                const input: string = await vm.console.getInput();
                vm.cpu.resume();
                const value = parseInt(input);
                if (value) {
                    const v0 = vm.cpu.getRegisters()[2].binary;
                    v0.set(value);
                    cpu.pc.set(cpu.pc.getValue() + 4);
                } else {
                    throw new Error(`Invalid input: ${input}`);
                }

            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "READ_FLOAT", 6
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "READ_DOUBLE", 7
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "READ_STRING", 8
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "SBRK", 9
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "EXIT", 10
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {

                vm.cpu.halt();

                vm.cpu.pc.set(vm.cpu.pc.getValue() + 4);

            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "PRINT_CHARACTER", 11
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "READ_CHARACTER", 12
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "OPEN_FILE", 13
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "READ_FROM_FILE", 14
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "WRITE_TO_FILE", 15
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "CLOSE_FILE", 16
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "EXIT2", 17
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "TIME", 30
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "MIDI_OUT", 31
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "SLEEP", 32
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "MIDI_OUT_SYNC", 33
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "PRINT_HEX", 34
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "PRINT_BINARY", 35
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "PRINT_UNSIGNED", 36
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "SET_SEED", 40
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "RANDOM_INT", 41
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "RANDOM_INT_RANGE", 42
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "RANDOM_FLOAT", 43
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "RANDOM_DOUBLE", 44
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "CONFIRM_DIALOG", 50
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "INPUT_DIALOG_INT", 51
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "INPUT_DIALOG_FLOAT", 52
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "INPUT_DIALOG_DOUBLE", 53
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "INPUT_DIALOG_STRING", 54
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "MESSAGE_DIALOG", 55
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "MESSAGE_DIALOG_INT", 56
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "MESSAGE_DIALOG_FLOAT", 57
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "MESSAGE_DIALOG_DOUBLE", 58
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine): void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

        this.syscalls.push(new class extends Syscall {
            constructor() {
                super(
                    "MESSAGE_DIALOG_STRING", 59
                );
            }
            execute(cpu: CPU, params: { [key: string]: Binary }, vm: VirtualMachine) : void {
                throw new Error(`${this.name} not implemented yet`);
            }
        });

    }

}