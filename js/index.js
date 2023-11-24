import { VirtualMachine } from "./VirtualMachine.js";
const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/mips");
const vm = new VirtualMachine();
updateInterface();
updateRegisters();
document.addEventListener('DOMContentLoaded', (event) => {
    var _a, _b, _c, _d, _e;
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
        updateRegisters();
    });
    (_c = document.getElementById('editor-overlay')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
        if (vm.getState() === "edit")
            return;
        vm.stop();
        updateEditor();
        updateInterface();
        updateRegisters();
    });
    (_d = document.getElementById('runInstruction-button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
        vm.runInstruction();
        updateEditor();
        updateRegisters();
    });
    (_e = document.getElementById('run-button')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
        vm.run();
        updateEditor();
        updateRegisters();
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
        let markers = editor.session.getMarkers(false);
        for (let i in markers) {
            if (markers[i].clazz === "next-instruction") {
                editor.session.removeMarker(markers[i].id);
            }
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
        const nextInstructionLine = vm.getNextInstructionLine();
        let markers = editor.session.getMarkers(false);
        for (let i in markers) {
            if (markers[i].clazz === "next-instruction") {
                editor.session.removeMarker(markers[i].id);
            }
        }
        if (nextInstructionLine) {
            let Range = ace.require('ace/range').Range, range = new Range(nextInstructionLine - 1, 0, nextInstructionLine - 1, Infinity);
            editor.session.addMarker(range, "next-instruction", "fullLine", false);
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
    document.getElementById('editor-overlay-container').style.display = "none";
}
function executeInterface() {
    document.getElementById('editor-container').style.width = "40%";
    document.getElementById('assemble-button').style.display = "none";
    document.getElementById('stop-button').style.display = "block";
    document.getElementById('run-button').style.display = "block";
    document.getElementById('runInstruction-button').style.display = "block";
    document.getElementById('editor-overlay-container').style.display = "block";
}
function updateRegisters() {
    let rows = "";
    let registers = vm.getRegisters();
    for (let i = 0; i < registers.length + 3; i++) {
        let register;
        if (i < registers.length) {
            register = registers[i];
        }
        else {
            if (i === 32)
                register = vm.getSpecialRegister("pc");
            if (i === 33)
                register = vm.getSpecialRegister("hi");
            if (i === 34)
                register = vm.getSpecialRegister("lo");
        }
        let number = "";
        if (i < registers.length)
            number = `${i}`;
        rows += `
            <div class="row">
                <div class="row-item name">
                    ${register.name}
                </div>
                <!--
                <div class="row-item number">
                    ${number}
                </div>
                -->
                <div class="row-item value">
                    ${register.value}
                </div>
            </div>
        `;
    }
    document.getElementById('registers').innerHTML = `
            <div class="label">Registers</div>
                <div class="table">
                    ${rows}
                </div>
        `;
}
