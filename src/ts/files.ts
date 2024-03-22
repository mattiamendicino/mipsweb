import {addEditor, removeEditor, switchToEditor} from "./editor.js";

export type file = {
    id: number,
    name: string,
    type: string,
    content: string
};

export function newFile() {
    console.log("New file");
    const files = getFiles();
    const fileName = generateUniqueName("untitled", files);
    const fileId = files.length > 0 ? Math.max(...files.map(file => file.id)) + 1 : 0;
    const fileToAdd: file = {
        id: fileId,
        name: fileName,
        type: "asm",
        content: ""
    };
    addFile(fileToAdd);
}

export function importFile() {
    console.log("Import file");
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.asm';
    input.addEventListener('change', () => {
        const file = input.files![0];
        const reader = new FileReader();
        reader.onload = () => {
            const files = getFiles();
            const fileName = generateUniqueName(file.name.split(".")[0], files);
            const fileId = files.length > 0 ? Math.max(...files.map(file => file.id)) + 1 : 0;
            const fileToAdd: file = {
                id: fileId,
                name: fileName,
                type: "asm",
                content: reader.result as string
            };
            addFile(fileToAdd);
        };
        reader.readAsText(file);
    });
    input.click();
}

export function closeFile(fileId: number) {
    console.log(`Close file: ${fileId}`);
    removeFile(fileId);
}

function addFile(file: file) {
    console.log(`Add file: ${file.name}.${file.type} (${file.id})`);
    const files: file[] = getFiles();
    files.push(file);
    setFiles(files);
    addEditor(file);
    switchToFile(file.id);
}

export function removeFile(fileId: number) {
    console.log(`Remove file: ${fileId}`);
    let files = getFiles();
    setFiles(files.filter(file => file.id !== fileId));
    removeEditor(fileId);
    files = getFiles();
    if (files.length > 0) {
        switchToFile(files[files.length - 1].id);
    } else {
        localStorage.removeItem("currentFileId");
    }
}

export function switchToFile(fileId: number) {
    console.log(`Switch to file: ${fileId}`);
    localStorage.setItem("currentFileId", fileId.toString());
    switchToEditor(fileId);
}

export function getFiles(): file[] {
    const files = localStorage.getItem("files");
    return files ? JSON.parse(files) : [];
}

export function setFiles(files: file[]) {
    localStorage.setItem("files", JSON.stringify(files));
}

export function getFile(fileId: number): file | undefined {
    return getFiles().find(file => file.id === fileId);
}

function generateUniqueName(name: string, files: file[]): string {
    let newName = name;
    let i = 1;
    while (files.find(file => file.name === newName)) {
        newName = `${name}_${i + 1}`;
        i++;
    }
    return newName;
}

export function updateFile(fileId: number, content: string) {
    console.log(`Update file: ${fileId}`);
    const files = getFiles();
    const file = files.find(file => file.id === fileId);
    if (file) {
        file.content = content;
        setFiles(files);
    }
}