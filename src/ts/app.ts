import {VirtualMachine} from "./virtual-machine/VirtualMachine.js";
import {buttons} from "./buttons.js";
import {getFiles} from "./files.js";
import {currentEditorId, editors, initEditors, updateEditor} from "./editor.js";

export const vm = new VirtualMachine();

export function updateInterface() {

    if (currentEditorId !== null) updateEditor(editors[currentEditorId]);

    if (getFiles().length === 0) {
        displayElements("none", [
            "editor-container",
            "memory",
            "registers",
            "assemble",
            "step",
            "run",
            "stop"
        ]);
    } else if (getFiles().length > 0) {
        displayElements("flex", [
            "editor-container",
            "memory",
            "registers",
            "assemble",
            "step",
            "run",
            "stop"
        ]);
        const vmState = vm.getState();
        if (vmState === "edit") {
            displayElements("flex", [
                "assemble"
            ]);
            displayElements("none", [
                "step",
                "run",
                "stop"
            ]);
            document.getElementById("editor-container")!.style.right = "20%";
        } else if (vmState === "execute") {
            displayElements("none", [
                "assemble"
            ]);
            if (vm.getNextInstructionLine()) {
                displayElements("flex", [
                    "step", "run"
                ]);
            } else {
                displayElements("none", [
                    "step", "run"
                ]);
            }
            displayElements("flex", [
                "stop"
            ]);
            document.getElementById("editor-container")!.style.right = "60%";
        }

    }

}

function displayElements(display: "block" | "flex" | "none", elements: string[]) {
    elements.forEach(element => {
        const el = document.getElementById(element);
        if (el) el.style.display = display;
    });
}
document.addEventListener('DOMContentLoaded', () => {

    updateInterface();
    initEditors();

    document.querySelectorAll('.icon').forEach(icon => {
        const resourcePath = icon.getAttribute("data-resource");
        if (resourcePath) {
            fetch(resourcePath)
                .then(response => {
                    if (response.ok) return response.text();
                    else throw new Error('Network response was not ok.');
                })
                .then(svgContent => {
                    icon.innerHTML = svgContent;
                })
                .catch(error => {
                    console.error('Could not load the SVG:', error);
                });
        }
    });

    document.querySelectorAll('.button').forEach(button => {
        const buttonId = button.id;
        if (buttonId && buttons.has(buttonId)) button.addEventListener('click', buttons.get(buttonId)!);
    });

    document.body.style.opacity = "1";

});