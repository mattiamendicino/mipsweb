import {VirtualMachine} from "./VirtualMachine.js";

const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/mips");

const vm = new VirtualMachine();

updateInterface();

document.addEventListener('DOMContentLoaded', (event) => {

    document.body.style.opacity = "1";

    document.getElementById('assemble-button')?.addEventListener('click', () => {
        editorExecuteMode();
        vm.assemble(editor.getValue());
        updateInterface();
    });

    document.getElementById('stop-button')?.addEventListener('click', () => {
        editorEditMode();
        vm.stop();
        updateInterface();
    });

    document.getElementById('runInstruction-button')?.addEventListener('click', () => {
        vm.runInstruction();
    });

    document.getElementById('run-button')?.addEventListener('click', () => {
        vm.run();
    });

    document.getElementById('editor')?.addEventListener('click', () => {
        if (vm.getState() === "edit") return;
        editorEditMode();
        vm.stop();
        updateInterface();
    });

});

function editorExecuteMode() {
    editor.setOptions({
        readOnly: true,
        highlightActiveLine: false,
        highlightGutterLine: false
    });
    document.getElementsByClassName("ace_cursor")[Symbol.iterator]().next().value.style.display = "none";
}

function editorEditMode() {
    editor.setOptions({
        readOnly: false,
        highlightActiveLine: true,
        highlightGutterLine: true
    });
    document.getElementsByClassName("ace_cursor")[Symbol.iterator]().next().value.style.display = "block";
}

function updateInterface() {
    const vmState = vm.getState();
    if (vmState === "edit") {
        editInterface();
    } else if (vmState === "execute") {
        executeInterface();
    }
}

function editInterface() {
    document.getElementById('editor-container')!.style.width = "80%";
    document.getElementById('assemble-button')!.style.display = "block";
    document.getElementById('stop-button')!.style.display = "none";
    document.getElementById('run-button')!.style.display = "none";
    document.getElementById('runInstruction-button')!.style.display = "none";
}

function executeInterface() {
    document.getElementById('editor-container')!.style.width = "40%";
    document.getElementById('assemble-button')!.style.display = "none";
    document.getElementById('stop-button')!.style.display = "block";
    document.getElementById('run-button')!.style.display = "block";
    document.getElementById('runInstruction-button')!.style.display = "block";
}