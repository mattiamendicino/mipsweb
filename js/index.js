import { VirtualMachine } from "./VirtualMachine.js";
const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/mips");
const vm = new VirtualMachine();
updateInterface();
document.addEventListener('DOMContentLoaded', (event) => {
    var _a, _b, _c, _d, _e;
    document.body.style.opacity = "1";
    (_a = document.getElementById('assemble-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        editorExecuteMode();
        vm.assemble(editor.getValue());
        updateInterface();
    });
    (_b = document.getElementById('stop-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        editorEditMode();
        vm.stop();
        updateInterface();
    });
    (_c = document.getElementById('runInstruction-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        vm.runInstruction();
    });
    (_d = document.getElementById('run-button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
        vm.run();
    });
    (_e = document.getElementById('editor')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
        if (vm.getState() === "edit")
            return;
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
