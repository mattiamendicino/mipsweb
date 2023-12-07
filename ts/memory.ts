import {vm} from "./app.js";
import {word} from "./virtual-machine/Memory";

type memoryLine = {
    memoryArea: string | undefined;
    registers: string[];
    address: word;
    value: word;
}

export const memoryDiv = document.getElementById('memory')!;

export function updateMemory() {

    const memory = vm.getMemory();
    const memoryLines: memoryLine[] = [];

    for (const address of Array.from(memory.keys())) {
        const value = memory.get(address);

        let memoryArea = undefined;
        if (address >= 0x00400000 && address < 0x10000000) {
            memoryArea = "Text Segment";
        } else if (address >= 0x10000000 && address < 0x10040000) {
            memoryArea = "Data Segment";
        } else if (address >= 0x10040000 && address < 0x7FFFFFFC) {
            memoryArea = "Stack / Heap";
        }

        let registers: string[] = [];
        if (address == vm.getSpecialRegister("pc")!.value) registers.push("pc");
        if (address == vm.getRegisterByName("$gp")!.value) registers.push("$gp");
        if (address == vm.getRegisterByName("$sp")!.value) registers.push("$sp");

        memoryLines.push({
            memoryArea: memoryArea,
            registers: registers,
            address: address,
            value: value!
        });
    }

    let rows = "";

    for (const memoryLine of memoryLines) {
        const hexAddress = "0x" + memoryLine.address.toString(16).padStart(8, '0');
        const hexValue = "0x" + (memoryLine.value ? memoryLine.value.toString(16).padStart(8, '0') : "00000000");

        let registersHTML = "";
        for (const register of memoryLine.registers) {
            registersHTML += `<div class="register ${register}">${register}</div>`;
        }

        rows += `
            <div class="row">
                <div class="col memory-area">
                    ${memoryLine.memoryArea}
                </div>
                <div class="col registers">
                    ${registersHTML}
                </div>
                <div class="col address">
                    ${hexAddress}
                </div>
                <div class="col value">
                    ${hexValue}
                </div>
            </div>
        `;
    }

    memoryDiv.innerHTML = `
        <div class="title">Memory</div>
        <div class="table-container"><div class="table">
            ${rows}
        </div></div>
    `;

}