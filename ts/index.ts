import {VirtualMachine} from "./VirtualMachine.js";

const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/mips");

const vm = new VirtualMachine();

updateInterface();

document.addEventListener('DOMContentLoaded', (event) => {

    document.body.style.opacity = "1";

    document.getElementById('assemble-button')?.addEventListener('click', () => {
        vm.assemble(editor.getValue());
        updateEditor();
        updateInterface();
    });

    document.getElementById('stop-button')?.addEventListener('click', () => {
        vm.stop();
        updateEditor();
        updateInterface();
    });

    document.getElementById('runInstruction-button')?.addEventListener('click', () => {
        vm.runInstruction();
    });

    document.getElementById('run-button')?.addEventListener('click', () => {
        vm.run();
    });

});

function updateEditor() {
    const vmState = vm.getState();
    const cursors = document.getElementsByClassName("ace_hidden-cursors");
    if (vmState === "edit") {
        editor.setOptions({
            readOnly: false,
            highlightActiveLine: true,
            highlightGutterLine: true
        });
        for (let i = 0; i < cursors.length; i++) {
            (cursors[i] as HTMLElement).style.display = "block";
        }
    } else if (vmState === "execute") {
        editor.setOptions({
            readOnly: true,
            highlightActiveLine: false,
            highlightGutterLine: false
        });
        for (let i = 0; i < cursors.length; i++) {
            (cursors[i] as HTMLElement).style.display = "none";
        }
    }
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