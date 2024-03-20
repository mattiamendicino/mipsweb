import { updateInterface, vm } from "./app.js";
import { newFile } from "./files.js";
import { currentEditorId, editors } from "./editor.js";
export const buttons = new Map([
    ["settings", () => {
            console.log("Settings");
        }],
    ["assemble", () => {
            if (currentEditorId === null)
                return;
            vm.assemble(editors[currentEditorId].getValue());
            updateInterface();
        }],
    ["step", () => {
            vm.runInstruction();
            updateInterface();
        }],
    ["run", () => {
            vm.run();
            updateInterface();
        }],
    ["stop", () => {
            vm.stop();
            updateInterface();
        }],
    ["newFile", () => {
            vm.stop();
            newFile();
            updateInterface();
        }],
    ["importFile", () => {
            vm.stop();
            //importFile();
            updateInterface();
        }]
]);
export function execute(name) {
    const f = buttons.get(name);
    if (f)
        f();
}
