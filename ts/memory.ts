import {vm} from "./app.js";

export const memoryDiv = document.getElementById('memory')!;

export function updateMemory() {

    const memory = vm.getMemory();

    let rows = "";

    for (const address of Array.from(memory.keys())) {
        const value = memory.get(address);

        const hexAddress = "0x" + address.toString(16).padStart(8, '0');
        const hexValue = "0x" + (value ? value.toString(16).padStart(8, '0') : "00000000");

        rows += `
            <div class="row">
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