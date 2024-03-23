import { updateInterface, vm } from "./app.js";
import { getFile, importFile, newFile } from "./files.js";
import { updateRegisters } from "./registers.js";
import { updateEditor } from "./editor.js";
function settingsButton() {
    console.log("Settings");
}
function newFileButton() {
    console.log("New file button");
    vm.stop();
    newFile();
}
function importFileButton() {
    console.log("Import file button");
    vm.stop();
    importFile();
}
function assembleButton() {
    const currentFileId = localStorage.getItem("currentFileId");
    if (currentFileId) {
        const file = getFile(parseInt(currentFileId));
        if (file) {
            const fileContent = file.content;
            if (fileContent) {
                console.log(`Assemble: ${file.name}`);
                vm.assemble(fileContent);
                updateInterface();
                updateEditor();
            }
        }
    }
}
function stepButton() {
    console.log("Step");
    vm.runInstruction();
    updateRegisters();
    updateInterface();
    updateEditor();
}
function runButton() {
    console.log("Run");
    vm.run();
    updateRegisters();
    updateInterface();
    updateEditor();
}
function stopButton() {
    console.log("Stop");
    vm.stop();
    updateRegisters();
    updateInterface();
    updateEditor();
}
export function updateButtons() {
    const settingsHTMLElement = document.getElementById("settings");
    if (settingsHTMLElement)
        settingsHTMLElement.addEventListener("click", () => {
            settingsButton();
        });
    const newFileHTMLElement = document.getElementById("newFile");
    if (newFileHTMLElement)
        newFileHTMLElement.addEventListener("click", () => {
            newFileButton();
        });
    const importFileHTMLElement = document.getElementById("importFile");
    if (importFileHTMLElement)
        importFileHTMLElement.addEventListener("click", () => {
            importFileButton();
        });
    const assembleHTMLElement = document.getElementById("assemble");
    if (assembleHTMLElement)
        assembleHTMLElement.addEventListener("click", () => {
            assembleButton();
        });
    const stepHTMLElement = document.getElementById("step");
    if (stepHTMLElement)
        stepHTMLElement.addEventListener("click", () => {
            stepButton();
        });
    const runHTMLElement = document.getElementById("run");
    if (runHTMLElement)
        runHTMLElement.addEventListener("click", () => {
            runButton();
        });
    const stopHTMLElement = document.getElementById("stop");
    if (stopHTMLElement)
        stopHTMLElement.addEventListener("click", () => {
            stopButton();
        });
}
