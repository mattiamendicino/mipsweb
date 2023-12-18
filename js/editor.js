import { vm } from "./app.js";
export const editorContainerDiv = document.getElementById('editor-container');
export const editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/mips");
export function updateEditor() {
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
