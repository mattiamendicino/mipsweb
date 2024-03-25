import {vm} from "./app.js";
import {word} from "./virtual-machine/Memory.js";

type register = {
    number?: word | undefined;
    name: string;
    value: word
}

const registersRowsHTMLElement = document.getElementById('registers-rows')!;

export function updateRegisters() {
    console.log("Update registers");

    const registers: register[] = vm.getRegisters();

    registersRowsHTMLElement.innerHTML = '';

    for (let i = 0; i < registers.length + 3; i++) {

        let register: register;
        if (i < registers.length) {
            register = registers[i];
        } else if ((i >= 32) && (i <= 34)) {
            if (i === 32) register = vm.getSpecialRegister("pc")!;
            if (i === 33) register = vm.getSpecialRegister("hi")!;
            if (i === 34) register = vm.getSpecialRegister("lo")!;
        } else {
            throw new Error("Invalid register index");
        }

        const rowElement = document.createElement('div');
        rowElement.classList.add('row');

        // rowElement.classList.add('changed'); // Se il registro è cambiato

        const numberColumn = document.createElement('div');
        numberColumn.classList.add('col', 'number');
        if (register!.number !== undefined) {
            numberColumn.textContent = register!.number.toString();
        }
        rowElement.appendChild(numberColumn);

        const nameColumn = document.createElement('div');
        nameColumn.classList.add('col', 'name');
        nameColumn.textContent = register!.name;
        rowElement.appendChild(nameColumn);

        const valueColumn = document.createElement('div');
        valueColumn.classList.add('col', 'value');
        if (register!.value !== undefined) {
            valueColumn.textContent = register!.value.toString();
        }
        rowElement.appendChild(valueColumn);

        registersRowsHTMLElement.appendChild(rowElement);
    }
}