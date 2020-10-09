"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEverything = exports.deleteEverything = exports.createDirectoryTree = void 0;
async function createDirectoryTree(directoryClient, tree) {
    var parts = tree.split("/");
    let subDirectoryClient = directoryClient;
    for (let i = 0; i < parts.length; i++) {
        subDirectoryClient = subDirectoryClient.getDirectoryClient(parts[i]);
        await subDirectoryClient.createIfNotExists();
        if (!subDirectoryClient.exists()) {
            throw "Could not create tree " + tree;
        }
    }
    return subDirectoryClient;
}
exports.createDirectoryTree = createDirectoryTree;
async function deleteEverything(directoryClient) {
    var e_1, _a;
    let dirIter = directoryClient.listFilesAndDirectories();
    try {
        for (var dirIter_1 = __asyncValues(dirIter), dirIter_1_1; dirIter_1_1 = await dirIter_1.next(), !dirIter_1_1.done;) {
            const item = dirIter_1_1.value;
            if (item.kind === "directory") {
                var subDirectory = directoryClient.getDirectoryClient(item.name);
                await deleteEverything(subDirectory);
                await subDirectory.deleteIfExists();
            }
            else {
                console.log(`Deleting ${directoryClient.path}/${item.name}`);
                await directoryClient.deleteFile(item.name);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (dirIter_1_1 && !dirIter_1_1.done && (_a = dirIter_1.return)) await _a.call(dirIter_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.deleteEverything = deleteEverything;
async function listEverything(directoryClient, currentDirectoryPath) {
    var e_2, _a;
    let dirIter = directoryClient.listFilesAndDirectories();
    try {
        for (var dirIter_2 = __asyncValues(dirIter), dirIter_2_1; dirIter_2_1 = await dirIter_2.next(), !dirIter_2_1.done;) {
            const item = dirIter_2_1.value;
            if (item.kind === "directory") {
                console.log(`$directory\t: ${currentDirectoryPath + "/" + item.name}`);
                var subDirectory = directoryClient.getDirectoryClient(item.name);
                await listEverything(subDirectory, currentDirectoryPath + "/" + item.name);
            }
            else {
                console.log(`file\t: ${item.name}`);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (dirIter_2_1 && !dirIter_2_1.done && (_a = dirIter_2.return)) await _a.call(dirIter_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
exports.listEverything = listEverything;
//# sourceMappingURL=fileShareUtility.js.map