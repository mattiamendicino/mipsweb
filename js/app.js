var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VirtualMachine } from "./virtual-machine/VirtualMachine.js";
import { CPU } from "./virtual-machine/CPU.js";
import { addClass, getFromLocalStorage, removeClass, render, setIntoLocalStorage } from "./index.js";
import { default_settings } from "./settings.js";
import { actionsOnFile, changeFile, closeFile, getFiles, getSelectedFile, importFiles, importSample, newFile, openFile } from "./files.js";
import { initEditors } from "./editor.js";
import { Binary } from "./virtual-machine/Utils.js";
export const vm = new VirtualMachine(new CPU);
export let interfaceState = "edit";
document.body.classList.add('wait');
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    if (!getFromLocalStorage("settings")) {
        setIntoLocalStorage("settings", default_settings);
    }
    yield renderApp();
    initEditors();
    clearMemorySelectedFormats();
    document.body.classList.remove('wait');
}));
export function clearMemorySelectedFormats() {
    const settings = getFromLocalStorage('settings');
    if (settings) {
        for (const key in settings.colsFormats) {
            if (key.startsWith('memory-address-format_') || key.startsWith('memory-value-format_')) {
                delete settings.colsFormats[key];
            }
        }
        setIntoLocalStorage('settings', settings);
    }
}
export function renderApp() {
    return __awaiter(this, arguments, void 0, function* (newState = interfaceState) {
        interfaceState = newState;
        if (interfaceState === "execute") {
            addClass('execute', 'files-editors');
        }
        else {
            removeClass('execute', 'files-editors');
        }
        yield render('app', 'app.ejs');
    });
}
export function assemble() {
    return __awaiter(this, void 0, void 0, function* () {
        const file = getSelectedFile();
        if (file) {
            vm.assemble(file.content);
            yield renderApp("execute");
        }
    });
}
export function stop() {
    return __awaiter(this, void 0, void 0, function* () {
        vm.stop();
        clearMemorySelectedFormats();
        yield renderApp("edit");
    });
}
export function step() {
    return __awaiter(this, void 0, void 0, function* () {
        vm.step();
        yield render('app', 'app.ejs');
    });
}
export function run() {
    return __awaiter(this, void 0, void 0, function* () {
        vm.run();
        yield render('app', 'app.ejs');
    });
}
export function getContext() {
    const intervals = getIntervals();
    return {
        vm,
        intervals: intervals,
        interfaceState: interfaceState,
        files: getFiles(),
        selectedFile: getSelectedFile(),
        settings: getFromLocalStorage('settings')
    };
}
export function getIntervals() {
    const memory = vm.getMemory();
    if (memory.length === 0) {
        return [];
    }
    const intervals = [];
    let currentInterval = [memory[0]];
    for (let i = 1; i < memory.length; i++) {
        const currentCell = memory[i];
        const previousCell = memory[i - 1];
        if (currentCell.address - previousCell.address <= 4) {
            currentInterval.push(currentCell);
        }
        else {
            intervals.push(extendInterval(currentInterval, intervals.length));
            currentInterval = [currentCell];
        }
    }
    intervals.push(extendInterval(currentInterval, intervals.length));
    return intervals;
}
export function extendInterval(cells, index) {
    const settings = getFromLocalStorage('settings');
    const interval = {
        cells: cells,
        colsFormats: {
            address: settings.colsFormats['memory-address-format'],
            value: settings.colsFormats['memory-value-format']
        }
    };
    if ((interval.cells[0].address >= 4194304) && (interval.cells[interval.cells.length - 1].address <= 268500992)) {
        interval.colsFormats.value = 'asm';
    }
    if (settings.colsFormats[`memory-address-format_${index}`]) {
        interval.colsFormats.address = settings.colsFormats[`memory-address-format_${index}`];
    }
    if (settings.colsFormats[`memory-value-format_${index}`]) {
        interval.colsFormats.value = settings.colsFormats[`memory-value-format_${index}`];
    }
    return interval;
}
window.colFormatSelectOnChange = function (element) {
    return __awaiter(this, void 0, void 0, function* () {
        let settings = getFromLocalStorage("settings");
        if (!settings) {
            settings = default_settings;
        }
        else if (!settings.colsFormats) {
            settings.colsFormats = default_settings.colsFormats;
        }
        settings.colsFormats[element.id] = element.value;
        setIntoLocalStorage('settings', settings);
        yield renderApp();
    });
};
window.assembleClick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield assemble();
    });
};
window.stepClick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield step();
    });
};
window.runClick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield run();
    });
};
window.stopClick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield stop();
    });
};
window.newFileOnClick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield newFile();
    });
};
window.importFilesOnClick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        importFiles();
    });
};
window.openFileOnClick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield openFile();
    });
};
window.importSampleOnClick = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield importSample(name);
    });
};
window.changeFileOnClick = function (stringFileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileId = parseInt(stringFileId);
        yield changeFile(fileId);
    });
};
window.actionsOnFileOnClick = function (stringFileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileId = parseInt(stringFileId);
        actionsOnFile(fileId);
    });
};
window.closeFileOnClick = function (stringFileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileId = parseInt(stringFileId);
        yield closeFile(fileId);
    });
};
window.convert = function (format, value, signed = false) {
    if (format === 'decimal') {
        return value;
    }
    if (format === 'hexadecimal') {
        return new Binary(value, 32, signed).getHex();
    }
    if (format === 'binary') {
        return new Binary(value, 32, signed).getBinary();
    }
    if (format === 'ascii') {
        return new Binary(value, 32, signed).getAscii();
    }
    if (format === 'asm') {
        const decodedInstruction = vm.cpu.decode(new Binary(value));
        if (decodedInstruction) {
            return decodedInstruction.basic;
        }
    }
    return 'undefined';
};
