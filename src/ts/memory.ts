

/*
import {word} from "./virtual-machine/Memory.js";
import {vm} from "./app.js";

type cell = {
    address: word;
    value: word;
}

type interval = {
    start: word;
    end: word;
    size: number;
}

export const memoryDiv = document.getElementById('memory')!;

let intervals: interval[] = [];

export function updateMemory() {

    const memory: Map<word, word> = vm.getMemory();

    let memoryIntervals: interval[] = getMemoryIntervals(memory);

    intervals.forEach((interval) => {
        memoryIntervals.push(interval);
    });

    memoryIntervals = mergedIntervals(memoryIntervals);

    let intervalsHTML = "";

    memoryIntervals.forEach((interval, index) => {

        let rowsHTML = `
                <div class="row">
                    <div class="col col-name address">Address</div>
                    <div class="col col-name value">Value</div>
                </div>
            `;

        if (interval.size < 10) {
            rowsHTML += `
                    <div class="row">
                        <div class="col button addCellButton" data-address="${interval.start - 4}">+</div>
                    </div>
            `;
        } else {
            rowsHTML += `
                    <div class="row">
                        <div class="col button upCellButton" data-intervalStart="${interval.start}" data-intervalEnd="${interval.end}">↑</div>
                    </div>
            `;
        }

        for (const cell of getMemoryCells(interval, memory)) {
            rowsHTML += `
                <div class="row">
                    <div class="col address">0x${cell.address.toString(16).padStart(8, '0')}</div>
                    <div class="col value">0x${cell.value.toString(16).padStart(8, '0')}</div>
                </div>
            `;
        }

        if (interval.size < 10) {
            rowsHTML += `
                    <div class="row">
                        <div class="col button addCellButton" data-address="${interval.end + 4}">+</div>
                    </div>
            `;
        } else {
            rowsHTML += `
                    <div class="row">
                        <div class="col button downCellButton" data-intervalStart="${interval.start}" data-intervalEnd="${interval.end}">↓</div>
                    </div>
            `;
        }

        intervalsHTML += `
            <div class="interval">
                <div class="interval-table">
                    ${rowsHTML}
                </div>
            </div>
        `;

    });

    memoryDiv.innerHTML = `
        <div class="title">MEMORY</div>
        <div class="intervals">${intervalsHTML}</div>
    `;

    document.querySelectorAll(".addCellButton").forEach((element) => {
        element.addEventListener("click", () => {
            const address = Number(element.getAttribute("data-address"));
            addCell(address);
        });
    });

    document.querySelectorAll(".upCellButton").forEach((element) => {
        element.addEventListener("click", () => {
            const intervalStart = Number(element.getAttribute("data-intervalStart"));
            const intervalEnd = Number(element.getAttribute("data-intervalEnd"));
            addCell(intervalEnd + 4);
            removeCell(intervalStart);
        });
    });

    document.querySelectorAll(".downCellButton").forEach((element) => {
        element.addEventListener("click", () => {
            const intervalStart = Number(element.getAttribute("data-intervalStart"));
            const intervalEnd = Number(element.getAttribute("data-intervalEnd"));
            addCell(intervalStart - 4);
            removeCell(intervalEnd);
        });
    });

}

function addCell(address: word) {
    addInterval(address, address);
}

function removeCell(address: word) {
    removeInterval(address, address);
}

function addInterval(start: word, end: word) {
    intervals.push(newInterval(start, end));
    updateMemory();
}

function removeInterval(start: word, end: word) {
    if (start > end) throw new Error('');

    const intervalsToAdd: interval[] = [];
    let intervalsToRemove: number[] = [];

    intervals.forEach((interval, index) => {
        if (interval.start > interval.end) throw new Error('');
        if ((start < interval.start) && (interval.start < end) && (end < interval.end)) {
            intervalsToAdd.push(newInterval(end, interval.end));
        }
        if ((interval.start < start) && (start < interval.end) && (interval.end < end)) {
            intervalsToAdd.push(newInterval(interval.start, start));
        }
        if ((interval.start < start) && (end < interval.end)) {
            intervalsToAdd.push(newInterval(interval.start, start));
            intervalsToAdd.push(newInterval(end, interval.end));
        }
        if ((start < interval.start) && (interval.end < end)) {
            intervalsToRemove.push(index);
        }
    });

    intervalsToRemove.forEach((index) => {
        intervals.splice(index, 1);
    });

    intervalsToAdd.forEach((interval) => {
        intervals.push(interval);
    });

    intervals = mergedIntervals(intervals);
}

function sortIntervals(intervals: interval[]) {
    intervals.sort((a, b) => a.start - b.start);
}

function mergedIntervals(intervals: interval[]): interval[] {
    sortIntervals(intervals);

    let mergedIntervals: interval[] = [];
    let currentInterval = intervals[0];

    for (let i = 1; i < intervals.length; i++) {
        const nextInterval = intervals[i];

        if (currentInterval.end >= nextInterval.start - 4) {
            currentInterval.end = Math.max(currentInterval.end, nextInterval.end);
            currentInterval.size = (currentInterval.end - currentInterval.start) / 4 + 1;
        } else {
            mergedIntervals.push(currentInterval);
            currentInterval = nextInterval;
        }
    }

    mergedIntervals.push(currentInterval);

    return mergedIntervals;
}

function newInterval(start: word, end: word): interval {
    if (start % 4 !== 0) throw new Error('');
    if (end % 4 !== 0) throw new Error('');
    if (start > end) throw new Error('');
    return {
        start: start,
        end: end,
        size: (end - start) / 4 + 1
    };
}

function getMemoryCells(interval: interval, memory: Map<word, word>): cell[] {
    let cells: cell[] = [];
    let address = interval.start;
    for (let i = 0; i < interval.size; i++) {
        let value = memory.get(address);
        if (!value) {
            value = 0;
        }
        cells.push({address: address, value: value});
        address += 4;
    }
    return cells;
}

function getMemoryIntervals(memory: Map<word, word>): interval[] {
    const intervals: interval[] = [];

    let current: interval | undefined = undefined;
    for(const [address] of memory) {
        if (!current) {
            current = {start: address, end: address, size: 1};
        } else if (address === current.end + 4) {
            current.end = address;
            current.size ++;
        } else {
            intervals.push(current);
            current = { start: address, end: address, size: 1};
        }
    }
    if (current) intervals.push(current);

    return intervals;
}

/*

export function updateMemory() {

    const memory = vm.getMemory();
    const textLines: memoryLine[] = [];
    const dataLines: memoryLine[] = [];
    const stackHeapLines: memoryLine[] = [];

    for (const address of Array.from(memory.keys()) as word[]) {
        const value = memory.get(address);
        let registers: string[] = [];
        if (address == vm.getSpecialRegister("pc")!.value) registers.push("pc");
        if (address == vm.getRegisterByName("$gp")!.value) registers.push("$gp");
        if (address == vm.getRegisterByName("$sp")!.value) registers.push("$sp");

        if (address >= 0x00400000 && address < 0x10000000) {
            textLines.push({
                registers: registers,
                address: address,
                value: value!
            });
        } else if (address >= 0x10000000 && address < 0x10040000) {
            dataLines.push({
                registers: registers,
                address: address,
                value: value!
            });
        } else if (address >= 0x10040000 && address < 0x7FFFFFFC) {
            stackHeapLines.push({
                registers: registers,
                address: address,
                value: value!
            });
        }
    }

    memoryDiv.innerHTML = `
        <div class="title">MEMORY</div>
        <div class="table-container"><div class="table">
            ${segmentHTML("TEXT SEGMENT","text", textLines)}
            ${segmentHTML("DATA SEGMENT", "data", dataLines)}
            ${segmentHTML("STACK / HEAP", "stack-heap", stackHeapLines)}
        </div></div>
    `;

}

function segmentHTML(segmentName: string, className: string, lines: memoryLine[]): string {
    let HTML= `<div class="memory-segment ${className}">`;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const hexAddress = "0x" + line.address.toString(16).padStart(8, '0');
        const hexValue = "0x" + (line.value ? line.value.toString(16).padStart(8, '0') : "00000000");

        let registersHTML = "";
        for (const register of line.registers) {
            if (register.charAt(0) === "$") {
                registersHTML += `<div class="register ${register.substring(1)}">${register}</div>`;
            } else {
                registersHTML += `<div class="register ${register}">${register}</div>`;
            }
        }

        let colSegmentName = "";
        if (i == 0) colSegmentName = segmentName;

        HTML += `
            <div class="row">
                <div class="col segment">
                    ${colSegmentName}
                </div>
                <div class="col registers">
                    ${registersHTML}
                </div>
                <div class="col address">
                    ${hexAddress}
                </div>
                <div class="col value">
                    ${hexValue}
                </div>
            </div>
        `;
    }
    HTML += `</div>`;

    return HTML;
}
 */