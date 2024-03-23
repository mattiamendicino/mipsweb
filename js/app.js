import { updateButtons } from "./buttons.js";
import { VirtualMachine } from "./virtual-machine/VirtualMachine.js";
import { getFiles } from "./files.js";
import { initEditors } from "./editor.js";
import { updateRegisters } from "./registers.js";
export const vm = new VirtualMachine();
document.addEventListener('DOMContentLoaded', () => {
    updateInterface();
    updateButtons();
    loadSVGIcons();
    initEditors();
    updateRegisters();
    document.body.style.opacity = "1";
});
export function updateInterface() {
    console.log("Update interface");
    displayElements("none", [
        "header",
        "settings",
        "content",
        "newFile",
        "importFile",
        "assemble",
        "step",
        "run",
        "stop",
        "editor-container",
        "memory",
        "registers"
    ]);
    const files = getFiles();
    if (files.length === 0) {
        displayElements("flex", [
            "header",
            "settings",
            "content",
            "newFile",
            "importFile"
        ]);
    }
    else if (files.length > 0) {
        displayElements("flex", [
            "header",
            "settings",
            "content",
            "newFile",
            "importFile",
            "editor-container",
            "memory",
            "registers"
        ]);
        const vmState = vm.getState();
        if (vmState === "edit") {
            displayElements("flex", [
                "assemble"
            ]);
            document.getElementById("editor-container").style.right = "20%";
        }
        else if (vmState === "execute") {
            displayElements("flex", [
                "step",
                "run",
                "stop"
            ]);
            document.getElementById("editor-container").style.right = "60%";
            if (!vm.getNextInstructionLine()) {
                displayElements("none", [
                    "step",
                    "run"
                ]);
            }
        }
    }
}
export function loadSVGIcons() {
    console.log("Load SVG icons");
    document.querySelectorAll('.icon').forEach(icon => {
        const resourcePath = icon.getAttribute("data-resource");
        if (resourcePath && !icon.hasAttribute("data-loaded")) { // Aggiungi un controllo per evitare ricaricamenti
            fetch(resourcePath)
                .then(response => {
                if (response.ok)
                    return response.text();
                else
                    throw new Error('Network response was not ok.');
            })
                .then(svgContent => {
                icon.innerHTML = svgContent;
                icon.setAttribute("data-loaded", "true"); // Segna l'icona come caricata
            })
                .catch(error => {
                console.error('Could not load the SVG:', error);
            });
        }
    });
}
function displayElements(display, elements) {
    elements.forEach(element => {
        const el = document.getElementById(element);
        if (el)
            el.style.display = display;
    });
}
