import {vm} from "./app.js";
import {word} from "./virtual-machine/Memory.js";

type memoryLine = {
    registers: string[];
    address: word;
    value: word;
}

export const memoryDiv = document.getElementById('memory')!;

export function updateMemory() {

    const memory = vm.getMemory();
    const textLines: memoryLine[] = [];
    const dataLines: memoryLine[] = [];
    const stackHeapLines: memoryLine[] = [];

    for (const address of Array.from(memory.keys())) {
        const value = memory.get(address);

        let registers: string[] = [];
        if (address == vm.getSpecialRegister("pc")!.value) registers.push("pc");
        if (address == vm.getRegisterByName("$gp")!.value) registers.push("$gp");
        if (address == vm.getRegisterByName("$sp")!.value) registers.push("$sp");

        if (address >= 0x00400000 && address < 0x10000000) {
            textLines.push({
                registers: registers,
                address: address,
                value: value!
            });
        } else if (address >= 0x10000000 && address < 0x10040000) {
            dataLines.push({
                registers: registers,
                address: address,
                value: value!
            });
        } else if (address >= 0x10040000 && address < 0x7FFFFFFC) {
            stackHeapLines.push({
                registers: registers,
                address: address,
                value: value!
            });
        }
    }

    memoryDiv.innerHTML = `
        <div class="title">MEMORY</div>
        <div class="table-container"><div class="table">
            ${segmentHTML("STACK / HEAP", "stack-heap", stackHeapLines)}
            ${segmentHTML("DATA SEGMENT", "data", dataLines)}
            ${segmentHTML("TEXT SEGMENT","text", textLines)}
        </div></div>
    `;

}

function segmentHTML(segmentName: string, className: string, lines: memoryLine[]): string {
    let HTML= `<div class="memory-segment ${className}">`;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const hexAddress = "0x" + line.address.toString(16).padStart(8, '0');
        const hexValue = "0x" + (line.value ? line.value.toString(16).padStart(8, '0') : "00000000");

        let registersHTML = "";
        for (const register of line.registers) {
            if (register.charAt(0) === "$") {
                registersHTML += `<div class="register ${register.substring(1)}">${register}</div>`;
            } else {
                registersHTML += `<div class="register ${register}">${register}</div>`;
            }
        }

        let colSegmentName = "";
        if (i == 0) colSegmentName = segmentName;

        HTML += `
            <div class="row">
                <div class="col segment">
                    ${colSegmentName}
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
    HTML += `</div>`;

    return HTML;
}