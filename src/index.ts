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
import { ShareServiceClient, StorageSharedKeyCredential } from "@azure/storage-file-share";

// Lib to Generate unique ID's
import { v4 as Guid } from "uuid";

// utility methods in same folder
import { createDirectoryTree } from "./fileShareUtility";
import { FileType, GwOutcome, NCFSOutcome, RequestMode, TransactionAdaptionEventModel } from "./TransactionAdaptionEventModel";

const credential = new StorageSharedKeyCredential(account, accountKey);
const serviceClient = new ShareServiceClient(
  `https://${account}.file.core.windows.net`,
  credential
);

var shareClient = serviceClient.getShareClient(shareName);

function getMetadataPayload(fileId: string, timestamp: Date): Buffer {
  return Buffer.from(JSON.stringify(
    {
      Events: [
        TransactionAdaptionEventModel.NewDocumentEvent(Guid(), RequestMode.Response, fileId, timestamp),
        TransactionAdaptionEventModel.FileTypeDetectedEvent(FileType.Docx, fileId, timestamp),
        TransactionAdaptionEventModel.RebuildEventStarting(fileId, timestamp),
        TransactionAdaptionEventModel.RebuildCompletedEvent(GwOutcome.Replace, fileId, timestamp),
        TransactionAdaptionEventModel.AnalysisCompletedEvent(fileId, timestamp),
        TransactionAdaptionEventModel.NcfsStartedEvent(fileId, timestamp),
        TransactionAdaptionEventModel.NcfsCompletedEvent(NCFSOutcome.Replaced, fileId, timestamp),
      ]
    }))
}

async function main() {

  let currentHourDate = new Date(dateRangeStart);
  do {
    const nextHour = currentHourDate.getTime() + (1 * 60 * 60 * 1000);

    for (let i = 0; i < numberOfFilesPerHour; i++) {
      const fileId = Guid();

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

      var directory = await createDirectoryTree(shareClient.getDirectoryClient(""), fileDirectory);

      var metadataFile = await directory.createFile("metadata.json", 0);
      await metadataFile.fileClient.uploadData(getMetadataPayload(fileId, timestamp));

      const report = await directory.createFile("report.xml", 0);
      await report.fileClient.uploadData(Buffer.from("<xml></xml>"));
    }

    currentHourDate.setTime(nextHour);
  } while (currentHourDate < dateRangeEnd)
}

main().then(() => {
  console.log("Done");
  // return deleteEverything(shareClient.getDirectoryClient(""));
  // return listEverything(shareClient.getDirectoryClient(""), "");
}, reason => {
  throw reason;
});