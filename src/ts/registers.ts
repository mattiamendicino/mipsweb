/*
import {vm} from "./app.js";
import {register} from "./virtual-machine/Registers.js";


export const registersDiv = document.getElementById('registers')!;

export function updateRegisters() {
    let rows = "";
    let registers = vm.getRegisters();
    for (let i = 0; i < registers.length + 3; i++) {
        let register: register;
        if (i < registers.length) {
            register = registers[i];
        } else {
            if (i === 32) register = vm.getSpecialRegister("pc")!;
            if (i === 33) register = vm.getSpecialRegister("hi")!;
            if (i === 34) register = vm.getSpecialRegister("lo")!;
        }
        let number = "";
        if (i < registers.length) number = `${i}`;
        rows += `
            <div class="row">
                <div class="col name">
                    ${register!.name}
                </div>
                <!--
                <div class="col number">
                    ${number}
                </div>
                -->
                <div class="col value">
                    ${register!.value}
                </div>
            </div>
        `;
    }
    registersDiv.innerHTML = `
            <div class="title">REGISTERS</div>
            <div class="table-container"><div class="table">
                ${rows}
            </div></div>
        `;
}
 */