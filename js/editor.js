import { getFiles, updateFile } from "./files.js";
import { execute } from "./buttons.js";
import { vm } from "./app.js";
export let editors = [];
export let currentEditorId = null;
export let tabsContainer = document.getElementById('files-tabs');
export let editorsContainer = document.getElementById('editors');
export function initEditors() {
    const files = getFiles();
    files.forEach(file => addTab(file));
}
export function addTab(file) {
    const fileId = editors.length;
    const tab = document.createElement('div');
    tab.textContent = file.name;
    tab.className = 'file-tab';
    tab.dataset.editorId = fileId.toString();
    tab.addEventListener('click', () => switchToEditor(fileId));
    tabsContainer.appendChild(tab);
    const editorDiv = document.createElement('div');
    editorDiv.className = 'editor';
    editorsContainer.appendChild(editorDiv);
    const editor = ace.edit(editorDiv);
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/mips");
    editor.setValue(file.content);
    editor.on("change", () => updateFile(file.id, editor.getValue()));
    editors.push(editor);
    editorDiv.style.display = 'none';
    if (editors.length === 1) {
        switchToEditor(0);
    }
}
export function switchToEditor(editorId) {
    execute("stop");
    if (currentEditorId !== null) {
        const currentEditorDiv = editors[currentEditorId].container;
        currentEditorDiv.style.display = 'none';
        const currentTab = tabsContainer.querySelector(`.file-tab[data-editor-id="${currentEditorId}"]`);
        currentTab.classList.remove('current');
    }
    const newEditorDiv = editors[editorId].container;
    newEditorDiv.style.display = 'block';
    currentEditorId = editorId;
    const newTab = tabsContainer.querySelector(`.file-tab[data-editor-id="${editorId}"]`);
    newTab.classList.add('current');
    editors[editorId].clearSelection();
    editors[editorId].focus();
}
export function editorNewFile(file) {
    addTab(file);
    switchToEditor(editors.length - 1);
}
export function updateEditor(editor) {
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
        editor.session.clearBreakpoints();
        editor.focus();
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
        editor.session.clearBreakpoints();
        if (nextInstructionLine) {
            let Range = ace.require('ace/range').Range, range = new Range(nextInstructionLine - 1, 0, nextInstructionLine - 1, Infinity);
            editor.session.addMarker(range, "next-instruction", "fullLine", false);
            editor.session.setBreakpoint(nextInstructionLine - 1, "breakpoint");
        }
    }
}
