"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
////////////////////////////////////////////////////////////////
/* Variable Block */
const account = "";
const accountKey = "";
const shareName = "";
const numberOfFilesPerHour = 5;
const dateRangeStart = new Date(2020, 9, 1);
const dateRangeEnd = new Date(2020, 11, 31);
//////////////////////////////////////////////////////////////
// Azure library
const storage_file_share_1 = require("@azure/storage-file-share");
// Lib to Generate unique ID's
const uuid_1 = require("uuid");
// utility methods in same folder
const fileShareUtility_1 = require("./fileShareUtility");
const TransactionAdaptionEventModel_1 = require("./TransactionAdaptionEventModel");
const credential = new storage_file_share_1.StorageSharedKeyCredential(account, accountKey);
const serviceClient = new storage_file_share_1.ShareServiceClient(`https://${account}.file.core.windows.net`, credential);
var shareClient = serviceClient.getShareClient(shareName);
function getMetadataPayload(fileId, timestamp) {
    return Buffer.from(JSON.stringify({
        Events: [
            TransactionAdaptionEventModel_1.TransactionAdaptionEventModel.NewDocumentEvent(uuid_1.v4(), TransactionAdaptionEventModel_1.RequestMode.Response, fileId, timestamp),
            TransactionAdaptionEventModel_1.TransactionAdaptionEventModel.FileTypeDetectedEvent(TransactionAdaptionEventModel_1.FileType.Docx, fileId, timestamp),
            TransactionAdaptionEventModel_1.TransactionAdaptionEventModel.RebuildEventStarting(fileId, timestamp),
            TransactionAdaptionEventModel_1.TransactionAdaptionEventModel.RebuildCompletedEvent(TransactionAdaptionEventModel_1.GwOutcome.Replace, fileId, timestamp),
            TransactionAdaptionEventModel_1.TransactionAdaptionEventModel.AnalysisCompletedEvent(fileId, timestamp),
            TransactionAdaptionEventModel_1.TransactionAdaptionEventModel.NcfsStartedEvent(fileId, timestamp),
            TransactionAdaptionEventModel_1.TransactionAdaptionEventModel.NcfsCompletedEvent(TransactionAdaptionEventModel_1.NCFSOutcome.Replaced, fileId, timestamp),
        ]
    }));
}
async function main() {
    let currentHourDate = new Date(dateRangeStart);
    do {
        const nextHour = currentHourDate.getTime() + (1 * 60 * 60 * 1000);
        for (let i = 0; i < numberOfFilesPerHour; i++) {
            const fileId = uuid_1.v4();
            const timestamp = new Date(currentHourDate);
            timestamp.setTime(Math.random() * (nextHour - timestamp.getTime()) + timestamp.getTime());
            const fileDirectory = [
                timestamp.getFullYear().toString(),
                (timestamp.getMonth() + 1).toString(),
                timestamp.getDate().toString(),
                timestamp.getHours().toString(),
                fileId
            ].join("/");
            console.log(`Generating file for timestamp '${timestamp}' ${fileDirectory}`);
            var directory = await fileShareUtility_1.createDirectoryTree(shareClient.getDirectoryClient(""), fileDirectory);
            var metadataFile = await directory.createFile("metadata.json", 0);
            await metadataFile.fileClient.uploadData(getMetadataPayload(fileId, timestamp));
            const report = await directory.createFile("report.xml", 0);
            await report.fileClient.uploadData(Buffer.from("<xml></xml>"));
        }
        currentHourDate.setTime(nextHour);
    } while (currentHourDate < dateRangeEnd);
}
main().then(() => {
    console.log("Done");
    // return deleteEverything(shareClient.getDirectoryClient(""));
    // return listEverything(shareClient.getDirectoryClient(""), "");
}, reason => {
    throw reason;
});
//# sourceMappingURL=index.js.map