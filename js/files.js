import { editorNewFile } from "./editor.js";
export function getFiles() {
    const files = localStorage.getItem("files");
    return files ? JSON.parse(files) : [];
}
export function newFile() {
    const files = getFiles();
    const fileId = files.length > 0 ? Math.max(...files.map(file => file.id)) + 1 : 0;
    const newFile = {
        id: fileId,
        name: `untitled_${fileId}`,
        type: "asm",
        content: ""
    };
    files.push(newFile);
    localStorage.setItem("files", JSON.stringify(files));
    editorNewFile(newFile);
}
export function updateFile(fileId, content) {
    const files = getFiles();
    const file = files.find(file => file.id === fileId);
    if (file) {
        file.content = content;
        localStorage.setItem("files", JSON.stringify(files));
    }
}
