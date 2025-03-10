var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getOpenedFiles, getSelectedFile, getSelectedFileId, updateFile } from "./files.js";
import { Colors } from "./lib/Colors.js";
import { addClass, removeClass } from "./utils.js";
import { sidebar } from "./sidebar.js";
import { editorState, interfaceState, renderApp } from "./app.js";
import { vm } from "./virtual-machine.js";
export const aceEditorLightTheme = 'ace/theme/chrome';
export const aceEditorDarkTheme = 'ace/theme/one_dark';
export let editors = [];
export function getSelectedInstructionAddresses() {
    if (editorState === "edit")
        return [];
    const file = getSelectedFile();
    if (!file)
        return [];
    const fileId = file.id;
    const aceEditor = getAceEditor(file);
    let selectedInstructionAddresses = [];
    if (aceEditor) {
        const cursorPosition = aceEditor.getCursorPosition();
        const highlightedRow = cursorPosition.row + 1;
        vm.assembler.addressEditorsPositions.forEach((position, address) => {
            if (position.fileId === fileId && position.lineNumber === highlightedRow) {
                selectedInstructionAddresses.push(address);
            }
        });
    }
    return selectedInstructionAddresses;
}
export function renderEditors() {
    resizeEditors();
    const aceEditor = getAceEditor();
    if (aceEditor) {
        const cursors = document.getElementsByClassName("ace_cursor-layer");
        if (editorState === "edit") {
            aceEditor.setOptions({
                readOnly: false,
                highlightActiveLine: true
            });
            for (let i = 0; i < cursors.length; i++) {
                cursors[i].style.display = "block";
            }
            let markers = aceEditor.session.getMarkers(false);
            for (let i in markers) {
                if (markers[i].clazz === "next-instruction") {
                    aceEditor.session.removeMarker(markers[i].id);
                }
            }
            aceEditor.session.clearBreakpoints();
            aceEditor.focus();
        }
        else if (editorState === "execute") {
            aceEditor.setOptions({
                readOnly: true,
                highlightActiveLine: true
            });
            for (let i = 0; i < cursors.length; i++) {
                cursors[i].style.display = "none";
            }
            let markers = aceEditor.session.getMarkers(false);
            for (let i in markers) {
                if (markers[i].clazz === "next-instruction") {
                    aceEditor.session.removeMarker(markers[i].id);
                }
            }
            aceEditor.session.clearBreakpoints();
            selectNextInstruction();
        }
    }
}
export function selectNextInstruction() {
    if (vm.nextInstructionEditorPosition) {
        if (getSelectedFileId() === vm.nextInstructionEditorPosition.fileId) {
            const aceEditor = getAceEditor();
            if (aceEditor) {
                const nextInstructionLine = vm.nextInstructionEditorPosition.lineNumber;
                if (nextInstructionLine) {
                    let Range = ace.require('ace/range').Range, range = new Range(nextInstructionLine - 1, 0, nextInstructionLine - 1, Infinity);
                    aceEditor.session.addMarker(range, "next-instruction", "fullLine", false);
                    aceEditor.session.setBreakpoint(nextInstructionLine - 1, "breakpoint");
                }
            }
        }
    }
}
export function moveCursorToNextInstruction() {
    if (vm.nextInstructionEditorPosition) {
        if (getSelectedFileId() === vm.nextInstructionEditorPosition.fileId) {
            const aceEditor = getAceEditor();
            if (aceEditor) {
                const nextInstructionLine = vm.nextInstructionEditorPosition.lineNumber;
                aceEditor.gotoLine(nextInstructionLine);
            }
        }
    }
}
export function resizeEditors() {
    if (interfaceState === "execute") {
        addClass('execute', 'editors');
    }
    else {
        removeClass('execute', 'editors');
    }
    if (sidebar) {
        document.getElementById('editors').classList.add('sidebar-open');
    }
    else {
        document.getElementById('editors').classList.remove('sidebar-open');
    }
    for (const editor of editors) {
        editor.aceEditor.resize();
    }
}
export function updateEditorsTheme() {
    const theme = Colors.isDarkMode() ? aceEditorDarkTheme : aceEditorLightTheme;
    for (const editor of editors) {
        editor.aceEditor.setTheme(theme);
    }
}
export function removeEditor(fileId) {
    const editorHTMLElement = document.getElementById(`editor-${fileId}`);
    if (editorHTMLElement) {
        editorHTMLElement.remove();
    }
    editors = editors.filter(editor => editor.fileId !== fileId);
}
export function addEditor(file) {
    const editorHTMLDivElement = document.createElement('div');
    editorHTMLDivElement.id = `editor-${file.id}`;
    editorHTMLDivElement.className = 'editor';
    editorHTMLDivElement.style.opacity = '0';
    const editorsHTMLElement = document.getElementById('editors');
    if (editorsHTMLElement) {
        editorsHTMLElement.appendChild(editorHTMLDivElement);
    }
    const aceEditor = ace.edit(editorHTMLDivElement);
    aceEditor.commands.addCommand({
        name: 'find',
        bindKey: { win: 'Ctrl-F', mac: 'Ctrl-F' },
        exec: function () { },
    });
    if (Colors.isDarkMode()) {
        aceEditor.setTheme(aceEditorDarkTheme);
    }
    else {
        aceEditor.setTheme(aceEditorLightTheme);
    }
    aceEditor.session.setMode("ace/mode/mips");
    aceEditor.setValue(file.content, 1);
    editors.push({
        fileId: file.id,
        aceEditor: aceEditor
    });
    aceEditor.session.on("change", () => __awaiter(this, void 0, void 0, function* () {
        updateFile(file.id, aceEditor.getValue());
    }));
    aceEditor.getSession().selection.on("changeCursor", () => __awaiter(this, void 0, void 0, function* () {
        if (interfaceState === "execute") {
            yield renderApp();
        }
    }));
    aceEditor.on("dblclick", () => __awaiter(this, void 0, void 0, function* () {
        if (interfaceState === "execute") {
            yield renderApp("execute", "edit");
        }
    }));
    editorHTMLDivElement.style.opacity = '1';
}
export function showEditor(fileId) {
    if (fileId !== null) {
        for (const editor of editors) {
            const id = String(editor.fileId);
            const editorElement = document.getElementById(`editor-${id}`);
            if (editorElement) {
                const isActive = id == fileId.toString();
                editorElement.style.display = isActive ? 'block' : 'none';
                if (isActive) {
                    editor.aceEditor.focus();
                }
                editor.aceEditor.clearSelection();
            }
        }
    }
    else
        console.error('File id is null.', fileId);
}
export function getAceEditor(file = getSelectedFile()) {
    if (file) {
        for (const editor of editors) {
            if (editor.fileId === file.id) {
                return editor.aceEditor;
            }
        }
    }
    return undefined;
}
export function addEditors() {
    const files = getOpenedFiles();
    for (const file of files) {
        addEditor(file);
    }
}
export function initEditors() {
    const editorsElement = document.getElementById('editors');
    if (editorsElement) {
        editorsElement.innerHTML = '';
        editors = [];
        const files = getOpenedFiles();
        if (files.length > 0) {
            addEditors();
            showEditor(getSelectedFileId());
        }
    }
}
