import {updateInterface, vm} from "./app.js";
import {importFile, newFile} from "./files.js";

function settingsButton() {
    console.log("Settings");
}

function newFileButton() {
    vm.stop();
    newFile();
}

function importFileButton() {
    vm.stop();
    importFile();
}

function assembleButton() {
    console.log("Assemble");
}

function stepButton() {
    console.log("Step");
}

function runButton() {
    console.log("Run");
}

function stopButton() {
    console.log("Stop");
}

export function updateButtons() {

    const settingsHTMLElement = document.getElementById("settings")!;
    if (settingsHTMLElement) settingsHTMLElement.addEventListener("click", (event) => {
        settingsButton();
    });

    const newFileHTMLElement = document.getElementById("newFile")!;
    if (newFileHTMLElement) newFileHTMLElement.addEventListener("click", (event) => {
        newFileButton();
    });

    const importFileHTMLElement = document.getElementById("importFile")!;
    if (importFileHTMLElement) importFileHTMLElement.addEventListener("click", (event) => {
        importFileButton();
    });

    const assembleHTMLElement = document.getElementById("assemble")!;
    if (assembleHTMLElement) assembleHTMLElement.addEventListener("click", (event) => {
        assembleButton();
    });

    const stepHTMLElement = document.getElementById("step")!;
    if (stepHTMLElement) stepHTMLElement.addEventListener("click", (event) => {
        stepButton();
    });

    const runHTMLElement = document.getElementById("run")!;
    if (runHTMLElement) runHTMLElement.addEventListener("click", (event) => {
        runButton();
    });

    const stopHTMLElement = document.getElementById("stop")!;
    if (stopHTMLElement) stopHTMLElement.addEventListener("click", (event) => {
        stopButton();
    });

}

/*

import {updateInterface, vm} from "./app.js";
import {newFile} from "./files.js";

export const buttons: Map<string, () => void> = new Map<string, () => void>([
    ["settings", () => {
        console.log("Settings");
    }],
    ["assemble", () => {
        const program = "";
        vm.assemble(program);
        updateInterface();
    }],
    ["step", () => {
        vm.runInstruction();
        updateInterface();
    }],
    ["run", () => {
        vm.run();
        updateInterface();
    }],
    ["stop", () => {
        vm.stop();
        updateInterface();
    }],
    ["newFile", () => {
        vm.stop();
        newFile();
        updateInterface();
    }],
    ["importFile", () => {
        vm.stop();
        //importFile();
        updateInterface();
    }]
]);

export function execute(name: string) {
    const f = buttons.get(name);
    if (f) f();
}

 */