import { VirtualMachine } from "./virtual-machine/VirtualMachine.js";
import { editorContainerDiv } from "./editor.js";
import { assembleButton, buttons, runButton, runInstructionButton, stopButton } from "./buttons.js";
import { updateRegisters } from "./registers.js";
export const vm = new VirtualMachine();
export function updateInterface() {
    const vmState = vm.getState();
    if (vmState === "edit") {
        editorContainerDiv.style.width = "80%";
        assembleButton.div.style.display = "block";
        stopButton.div.style.display = "none";
        runButton.div.style.display = "none";
        runInstructionButton.div.style.display = "none";
    }
    else if (vmState === "execute") {
        editorContainerDiv.style.width = "40%";
        assembleButton.div.style.display = "none";
        stopButton.div.style.display = "block";
        runButton.div.style.display = "block";
        runInstructionButton.div.style.display = "block";
    }
}
updateInterface();
updateRegisters();
document.addEventListener('DOMContentLoaded', (event) => {
    document.body.style.opacity = "1";
    buttons.forEach(button => {
        button.div.addEventListener('click', () => {
            button.onClick();
        });
    });
});
