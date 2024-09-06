var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { vm, updateInterface } from "./app.js";
import { addFileEditor, removeFileEditor, showEditor } from "./editor.js";
import { removeClass, render } from "./index.js";
window.newFile = function () {
    return __awaiter(this, void 0, void 0, function () {
        var files, fileName, fileId, fileToAdd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = getFiles();
                    fileName = generateUniqueName("untitled", files);
                    fileId = files.length > 0 ? Math.max.apply(Math, files.map(function (file) { return file.id; })) + 1 : 0;
                    fileToAdd = {
                        id: fileId,
                        name: fileName,
                        type: "asm",
                        content: ""
                    };
                    return [4 /*yield*/, addFile(fileToAdd, files)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
window.importFile = function () {
    var _this = this;
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.asm';
    input.addEventListener('change', function () {
        var file = input.files[0];
        var reader = new FileReader();
        reader.onload = function () { return __awaiter(_this, void 0, void 0, function () {
            var files, fileName, fileId, fileToAdd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = getFiles();
                        fileName = generateUniqueName(file.name.split(".")[0], files);
                        fileId = files.length > 0 ? Math.max.apply(Math, files.map(function (file) { return file.id; })) + 1 : 0;
                        fileToAdd = {
                            id: fileId,
                            name: fileName,
                            type: "asm",
                            content: reader.result
                        };
                        return [4 /*yield*/, addFile(fileToAdd, files)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        reader.readAsText(file);
    });
    input.click();
};
window.changeFileTab = changeFileTab;
function changeFileTab(sFileId) {
    return __awaiter(this, void 0, void 0, function () {
        var fileId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileId = Number(sFileId);
                    setSelectedFileId(fileId);
                    showEditor(fileId);
                    return [4 /*yield*/, updateInterface()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
window.closeFile = function (sFileId) {
    return __awaiter(this, void 0, void 0, function () {
        var fileId, files, state, selectedFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileId = Number(sFileId);
                    files = getFiles();
                    setFiles(files.filter(function (file) { return file.id !== fileId; }));
                    removeFileEditor(fileId);
                    files = getFiles();
                    if (!(files.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, changeFileTab("".concat(files[files.length - 1].id))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    localStorage.removeItem('selectedFileId');
                    state = vm.getState();
                    selectedFile = getSelectedFile();
                    return [4 /*yield*/, render('app', 'app.ejs', { state: state, files: files, selectedFile: selectedFile })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
function addFile(file, files) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files.push(file);
                    setFiles(files);
                    setSelectedFileId(file.id);
                    return [4 /*yield*/, render('app', 'app.ejs', { state: "edit", files: files, selectedFile: file })];
                case 1:
                    _a.sent();
                    removeClass('execute', 'files-editors');
                    addFileEditor(file);
                    return [2 /*return*/];
            }
        });
    });
}
export function getFiles() {
    var files = localStorage.getItem("files");
    return files ? JSON.parse(files) : [];
}
export function setFiles(files) {
    localStorage.setItem("files", JSON.stringify(files));
}
export function getFile(fileId) {
    for (var _i = 0, _a = getFiles(); _i < _a.length; _i++) {
        var file = _a[_i];
        if (file.id === fileId)
            return file;
    }
    return null;
}
export function setSelectedFileId(fileId) {
    var file = getFile(fileId);
    if (file) {
        localStorage.setItem("selectedFileId", file.id.toString());
    }
}
export function getSelectedFile() {
    var fileId = getSelectedFileId();
    if (fileId !== null) {
        var files = getFiles();
        if (files.length > 0) {
            for (var _i = 0, _a = getFiles(); _i < _a.length; _i++) {
                var file = _a[_i];
                if (file.id === fileId)
                    return file;
            }
        }
    }
    localStorage.removeItem('selectedFileId');
    return null;
}
export function getSelectedFileId() {
    var fileId = localStorage.getItem("selectedFileId");
    return fileId ? Number(fileId) : null;
}
function generateUniqueName(name, files) {
    var newName = name;
    var i = 1;
    while (files.find(function (file) { return file.name === newName; })) {
        newName = "".concat(name, "_").concat(i);
        i++;
    }
    return newName;
}
export function updateFile(fileId, content) {
    var files = getFiles();
    var file = files.find(function (file) { return file.id === fileId; });
    if (file) {
        file.content = content;
        setFiles(files);
    }
}
