import {VirtualMachine} from "./virtual-machine/VirtualMachine.js";
import {CPU} from "./virtual-machine/CPU.js";
import {addClass, getFromLocalStorage, removeClass, render, setIntoLocalStorage} from "./index.js";
import {default_settings} from "./settings.js";
import {
    actionsOnFile,
    changeFile,
    closeFile,
    getFiles,
    getSelectedFile,
    importFiles,
    importSample,
    newFile,
    openFile
} from "./files.js";
import {initEditors} from "./editor.js";
import {Binary} from "./virtual-machine/Utils.js";

export const vm = new VirtualMachine(new CPU);

export let interfaceState: "edit" | "execute" = "edit";

document.body.classList.add('wait');
document.addEventListener('DOMContentLoaded', async () => {

    if (!getFromLocalStorage("settings")) {
        setIntoLocalStorage("settings", default_settings);
    }

    await renderApp();
    initEditors();
    clearMemorySelectedFormats();

    document.body.classList.remove('wait');
});

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

export async function renderApp(newState: "edit" | "execute" = interfaceState) {
    interfaceState = newState;
    if (interfaceState === "execute") {
        addClass('execute', 'files-editors');
    } else {
        removeClass('execute', 'files-editors');
    }
    await render('app', 'app.ejs');
}

export async function assemble() {
    const file = getSelectedFile();
    if (file) {
        vm.assemble(file.content);
        await renderApp("execute");
    }
}

export async function stop() {
    vm.stop();
    clearMemorySelectedFormats();
    await renderApp("edit");
}

export async function step() {
    vm.step();
    await render('app', 'app.ejs');
}

export async function run() {
    vm.run();
    await render('app', 'app.ejs');
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
        } else {
            intervals.push(extendInterval(currentInterval, intervals.length));
            currentInterval = [currentCell];
        }
    }
    intervals.push(extendInterval(currentInterval, intervals.length));
    return intervals;
}

export function extendInterval(cells: any, index: number) {
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

(window as any).colFormatSelectOnChange = async function(element: HTMLSelectElement) {
    let settings = getFromLocalStorage("settings");
    if (!settings) {
        settings = default_settings;
    } else if (!settings.colsFormats) {
        settings.colsFormats = default_settings.colsFormats;
    }
    settings.colsFormats[element.id] = element.value;
    setIntoLocalStorage('settings', settings);
    await renderApp();
};

(window as any).assembleClick = async function() {
    await assemble();
};

(window as any).stepClick = async function() {
    await step();
};

(window as any).runClick = async function() {
    await run();
};

(window as any).stopClick = async function() {
    await stop();
};

(window as any).newFileOnClick = async function() {
    await newFile();
};

(window as any).importFilesOnClick = async function() {
    importFiles();
};

(window as any).openFileOnClick = async function() {
    await openFile();
};

(window as any).importSampleOnClick = async function(name: string) {
    await importSample(name);
};

(window as any).changeFileOnClick = async function(stringFileId: string) {
    const fileId = parseInt(stringFileId);
    await changeFile(fileId);
};

(window as any).actionsOnFileOnClick = async function(stringFileId: string) {
    const fileId = parseInt(stringFileId);
    actionsOnFile(fileId);
};

(window as any).closeFileOnClick = async function(stringFileId: string) {
    const fileId = parseInt(stringFileId);
    await closeFile(fileId);
};

(window as any).convert = function(format: string, value: number, signed: boolean = false) {
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

