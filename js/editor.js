import { closeFile, getFiles, switchToFile, updateFile } from "./files.js";
import { loadSVGIcons, updateInterface, vm } from "./app.js";
export let editors = [];
export let tabsContainer = document.getElementById('files-tabs');
export let editorsContainer = document.getElementById('editors');
export function initEditors() {
    console.log("Init editors");
    const files = getFiles();
    files.forEach((file) => {
        addEditor(file);
    });
    if (getFiles().length > 0) {
        switchToEditor(parseInt(localStorage.getItem("currentFileId") || "0"));
    }
}
export function switchToEditor(fileId) {
    console.log(`Switch to editor: ${fileId}`);
    const tabsHTMLElements = document.getElementsByClassName('file-tab');
    for (let i = 0; i < tabsHTMLElements.length; i++) {
        tabsHTMLElements[i].classList.remove('current');
    }
    const editorsHTMLElements = document.getElementsByClassName('editor');
    for (let i = 0; i < editorsHTMLElements.length; i++) {
        editorsHTMLElements[i].style.display = 'none';
    }
    const tabHTMLElement = document.getElementById(`file-tab_${fileId}`);
    if (tabHTMLElement)
        tabHTMLElement.classList.add('current');
    const editorHTMLElement = document.getElementById(`editor_${fileId}`);
    if (editorHTMLElement)
        editorHTMLElement.style.display = 'block';
    const editor = editors.find(editor => editor.fileId === fileId);
    if (editor) {
        editor.aceEditor.focus();
        editor.aceEditor.clearSelection();
    }
}
export function addEditor(file) {
    console.log(`Add editor: ${file.id}`);
    const tab = document.createElement('div');
    tab.className = 'file-tab';
    tab.id = `file-tab_${file.id}`;
    tab.addEventListener('click', () => {
        switchToFile(file.id);
    });
    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = `${file.name}.${file.type}`;
    tab.appendChild(textDiv);
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'icon';
    actionsDiv.id = `actions_${file.id}`;
    actionsDiv.setAttribute('data-resource', 'resources/icons/actions.svg');
    actionsDiv.addEventListener('click', (event) => {
        event.stopPropagation();
        actionsOnFile(file.id);
    });
    tab.appendChild(actionsDiv);
    const closeFileDiv = document.createElement('div');
    closeFileDiv.className = 'icon svg-red';
    closeFileDiv.id = `closeFile_${file.id}`;
    closeFileDiv.setAttribute('data-resource', 'resources/icons/close.svg');
    closeFileDiv.addEventListener('click', (event) => {
        event.stopPropagation();
        closeFile(file.id);
    });
    tab.appendChild(closeFileDiv);
    tabsContainer.appendChild(tab);
    loadSVGIcons();
    const editorDiv = document.createElement('div');
    editorDiv.className = 'editor';
    editorDiv.id = `editor_${file.id}`;
    editorsContainer.appendChild(editorDiv);
    const editor = ace.edit(editorDiv);
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/mips");
    editor.setValue(file.content);
    editor.on("change", () => {
        updateFile(file.id, editor.getValue());
    });
    editorDiv.style.display = 'none';
    editors.push({
        fileId: file.id,
        aceEditor: editor
    });
    updateInterface();
}
export function removeEditor(fileId) {
    console.log(`Remove editor: ${fileId}`);
    const tab = document.getElementById(`file-tab_${fileId}`);
    if (tab)
        tab.remove();
    const editor = document.getElementById(`editor_${fileId}`);
    if (editor)
        editor.remove();
    editors = editors.filter(editor => editor.fileId !== fileId);
    updateInterface();
}
export function actionsOnFile(fileId) {
    console.log(`Actions on file: ${fileId}`);
}
export function updateEditor(editor) {
    const aceEditor = editor.aceEditor;
    const vmState = vm.getState();
    const cursors = document.getElementsByClassName("ace_hidden-cursors");
    if (vmState === "edit") {
        aceEditor.setOptions({
            readOnly: false,
            highlightActiveLine: true,
            highlightGutterLine: true
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
    else if (vmState === "execute") {
        aceEditor.setOptions({
            readOnly: true,
            highlightActiveLine: false,
            highlightGutterLine: false
        });
        for (let i = 0; i < cursors.length; i++) {
            cursors[i].style.display = "none";
        }
        const nextInstructionLine = vm.getNextInstructionLine();
        let markers = aceEditor.session.getMarkers(false);
        for (let i in markers) {
            if (markers[i].clazz === "next-instruction") {
                aceEditor.session.removeMarker(markers[i].id);
            }
        }
        aceEditor.session.clearBreakpoints();
        if (nextInstructionLine) {
            let Range = ace.require('ace/range').Range, range = new Range(nextInstructionLine - 1, 0, nextInstructionLine - 1, Infinity);
            aceEditor.session.addMarker(range, "next-instruction", "fullLine", false);
            aceEditor.session.setBreakpoint(nextInstructionLine - 1, "breakpoint");
        }
    }
}
