import {file, getFiles, getSelectedFileId, saveFile, updateFile} from "./files.js";

export type fileEditor = {
    fileId: number,
    aceEditor: AceAjax.Editor;
}

export let filesEditors: fileEditor[] = [];

export function removeFileEditor(fileId: number) {
    const fileEditorElement = document.getElementById(`file-editor-${fileId}`);
    if (fileEditorElement) {
        fileEditorElement.remove();
    }
    filesEditors = filesEditors.filter(fileEditor => fileEditor.fileId !== fileId);
}

export function showEditor(fileId: number | null) {

    if (fileId !== null) {
        for (const fileEditor of filesEditors) {
            const id = String(fileEditor.fileId);
            const editorElement = document.getElementById(`file-editor-${id}`);
            if (editorElement) {
                const isActive = id == fileId.toString();
                editorElement.style.display = isActive ? 'block' : 'none';
                if (isActive) {
                    fileEditor.aceEditor.focus();
                }
                fileEditor.aceEditor.clearSelection();
            }
        }
    } else console.error('File id is null.', fileId);

}

export function addFileEditor(file: file) {

    const fileEditorElement = document.createElement('div');
    fileEditorElement.id = `file-editor-${file.id}`;
    fileEditorElement.className = 'file-editor';

    const fileEditorsElement = document.getElementById('files-editors');
    if (fileEditorsElement) {
        fileEditorsElement.appendChild(fileEditorElement);
    }

    const aceEditor = ace.edit(fileEditorElement);
    aceEditor.setTheme("ace/theme/chrome");
    aceEditor.session.setMode("ace/mode/mips");
    aceEditor.setValue(file.content, 1);

    filesEditors.push({
        fileId: file.id,
        aceEditor: aceEditor
    });

    aceEditor.session.on("change", async () => {
        updateFile(file.id, aceEditor.getValue());
        await saveFile(file.id);
    });

    showEditor(file.id);
}

export function addFilesEditors() {
    const files = getFiles();
    for (const file of files) {
        addFileEditor(file);
    }
}

export function initEditors() {
    const filesEditorsElement = document.getElementById('files-editors');
    if (filesEditorsElement) {
        filesEditorsElement.innerHTML = '';
        filesEditors = [];
        const files = getFiles();
        if (files.length > 0) {
            addFilesEditors();
            showEditor(getSelectedFileId());
        }
    } else console.error('Element with id "files-editors" not found.');
}