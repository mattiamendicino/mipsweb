import { vm } from "./app.js";
export const registersContainerDiv = document.getElementById('registers-container');
export function updateRegisters() {
    let rows = "";
    let registers = vm.getRegisters();
    for (let i = 0; i < registers.length + 3; i++) {
        let register;
        if (i < registers.length) {
            register = registers[i];
        }
        else {
            if (i === 32)
                register = vm.getSpecialRegister("pc");
            if (i === 33)
                register = vm.getSpecialRegister("hi");
            if (i === 34)
                register = vm.getSpecialRegister("lo");
        }
        let number = "";
        if (i < registers.length)
            number = `${i}`;
        rows += `
            <div class="row">
                <div class="row-item name">
                    ${register.name}
                </div>
                <!--
                <div class="row-item number">
                    ${number}
                </div>
                -->
                <div class="row-item value">
                    ${register.value}
                </div>
            </div>
        `;
    }
    document.getElementById('registers').innerHTML = `
            <div class="label">Registers</div>
                <div class="table">
                    ${rows}
                </div>
        `;
}
