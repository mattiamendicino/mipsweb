import { editor, updateEditor } from "./editor.js";
import { updateInterface, vm } from "./app.js";
import { updateRegisters } from "./registers.js";
import { updateMemory } from "./memory.js";
export const buttons = [];
export const assembleButton = {
    div: document.getElementById('assemble-button'),
    onClick: () => {
        vm.assemble(editor.getValue());
        updateEditor();
        updateInterface();
        updateMemory();
    }
};
buttons.push(assembleButton);
export const stopButton = {
    div: document.getElementById('stop-button'),
    onClick: () => {
        vm.stop();
        updateEditor();
        updateInterface();
        updateRegisters();
    }
};
buttons.push(stopButton);
export const runButton = {
    div: document.getElementById('run-button'),
    onClick: () => {
        vm.run();
        updateMemory();
        updateEditor();
        updateRegisters();
    }
};
buttons.push(runButton);
export const runInstructionButton = {
    div: document.getElementById('runInstruction-button'),
    onClick: () => {
        vm.runInstruction();
        updateMemory();
        updateEditor();
        updateRegisters();
    }
};
buttons.push(runInstructionButton);
