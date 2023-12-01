import {editor, updateEditor} from "./editor.js";
import {updateInterface, vm} from "./app.js";
import {updateRegisters} from "./registers.js";

export type Button = {
    div: HTMLDivElement,
    onClick: () => void
}

export const buttons: Button[] = [];

export const assembleButton: Button = {
    div: document.getElementById('assemble-button')! as HTMLDivElement,
    onClick: () => {
        vm.assemble(editor.getValue());
        updateEditor();
        updateInterface();
    }
}
buttons.push(assembleButton);

export const stopButton: Button = {
    div: document.getElementById('stop-button')! as HTMLDivElement,
    onClick: () => {
        vm.stop();
        updateEditor();
        updateInterface();
        updateRegisters();
    }
}
buttons.push(stopButton);

export const runButton: Button = {
    div: document.getElementById('run-button')! as HTMLDivElement,
    onClick: () => {
        vm.run();
        updateEditor();
        updateRegisters();
    }
}
buttons.push(runButton);

export const runInstructionButton: Button = {
    div: document.getElementById('runInstruction-button')! as HTMLDivElement,
    onClick: () => {
        vm.runInstruction();
        updateEditor();
        updateRegisters();
    }
}
buttons.push(runInstructionButton);