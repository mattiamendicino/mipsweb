import {updateButtons} from "./buttons.js";
import {VirtualMachine} from "./virtual-machine/VirtualMachine.js";
import {getFiles} from "./files.js";
import {initEditors} from "./editor.js";

export const vm = new VirtualMachine();

document.addEventListener('DOMContentLoaded', () => {

    updateInterface();

    updateButtons();
    loadSVGIcons();
    initEditors();

    document.body.style.opacity = "1";

});

export function updateInterface() {

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

    if(files.length === 0) {

        displayElements("flex", [
            "header",
            "settings",
            "content",
            "newFile",
            "importFile"
        ]);

    } else if(files.length > 0) {

        displayElements("flex", [
            "header",
            "settings",
            "content",
            "newFile",
            "importFile",
            "editor-container"
        ]);

    }

}

export function loadSVGIcons() {
    document.querySelectorAll('.icon').forEach(icon => {
        const resourcePath = icon.getAttribute("data-resource");
        if (resourcePath && !icon.hasAttribute("data-loaded")) { // Aggiungi un controllo per evitare ricaricamenti
            fetch(resourcePath)
                .then(response => {
                    if (response.ok) return response.text();
                    else throw new Error('Network response was not ok.');
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

function displayElements(display: "block" | "flex" | "none", elements: string[]) {
    elements.forEach(element => {
        const el = document.getElementById(element);
        if (el) el.style.display = display;
    });
}

/*

import {VirtualMachine} from "./virtual-machine/VirtualMachine.js";
import {buttons} from "./buttons.js";
import {getFiles} from "./files.js";
import {editors, initEditors, updateEditor} from "./editor.js";

export const vm = new VirtualMachine();

export function updateInterface() {

    const currentFileId = localStorage.getItem("currentFileId");
    if (currentFileId) {
        const editor = editors.find(editor => editor.fileId === parseInt(currentFileId));
        if (editor) updateEditor(editor);
    }

    const files = getFiles();

    if (files.length === 0) {
        displayElements("none", [
            "editor-container",
            "memory",
            "registers",
            "assemble",
            "step",
            "run",
            "stop"
        ]);
    } else if (files.length > 0) {
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

 */