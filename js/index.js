import { VirtualMachine } from "./VirtualMachine.js";
const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/mips");
const vm = new VirtualMachine();
updateInterface();
document.addEventListener('DOMContentLoaded', (event) => {
    var _a, _b, _c, _d;
    document.body.style.opacity = "1";
    (_a = document.getElementById('assemble-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        vm.assemble(editor.getValue());
        updateEditor();
        updateInterface();
    });
    (_b = document.getElementById('stop-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        vm.stop();
        updateEditor();
        updateInterface();
    });
    (_c = document.getElementById('runInstruction-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        vm.runInstruction();
    });
    (_d = document.getElementById('run-button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
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
            cursors[i].style.display = "block";
        }
    }
    else if (vmState === "execute") {
        editor.setOptions({
            readOnly: true,
            highlightActiveLine: false,
            highlightGutterLine: false
        });
        for (let i = 0; i < cursors.length; i++) {
            cursors[i].style.display = "none";
        }
    }
}
function updateInterface() {
    const vmState = vm.getState();
    if (vmState === "edit") {
        editInterface();
    }
    else if (vmState === "execute") {
        executeInterface();
    }
}
function editInterface() {
    document.getElementById('editor-container').style.width = "80%";
    document.getElementById('assemble-button').style.display = "block";
    document.getElementById('stop-button').style.display = "none";
    document.getElementById('run-button').style.display = "none";
    document.getElementById('runInstruction-button').style.display = "none";
}
function executeInterface() {
    document.getElementById('editor-container').style.width = "40%";
    document.getElementById('assemble-button').style.display = "none";
    document.getElementById('stop-button').style.display = "block";
    document.getElementById('run-button').style.display = "block";
    document.getElementById('runInstruction-button').style.display = "block";
}
