import { FileType } from "../enums/FileType";
import { RequestMode } from "../enums/RequestMode";
import { TransactionAdaptionEventModel } from "./transactionAdaptionEventModel";
import { v4 as Guid } from "uuid";
import { GwOutcome } from "../enums/GwOutcome";
import { NCFSOutcome } from "../enums/NCFSOutcome";

function randomEnum<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum)
      .map(n => Number.parseInt(n))
      .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const randomEnumValue = enumValues[randomIndex]
    return randomEnumValue;
  }

export default class transactionAdaptionEventMetadataFile {
    Events: TransactionAdaptionEventModel[];

    constructor(
        fileId: string = Guid(), 
        timestamp: Date = new Date(),
        fileType: FileType = randomEnum(FileType),
        requestMode: RequestMode = randomEnum(RequestMode),
        gwOutcome: GwOutcome = randomEnum(GwOutcome),
        ncfsOutcome: NCFSOutcome = randomEnum(NCFSOutcome)) {
        this.Events = [
              TransactionAdaptionEventModel.NewDocumentEvent(Guid(), requestMode, fileId, timestamp),
              TransactionAdaptionEventModel.FileTypeDetectedEvent(fileType, fileId, timestamp),
              TransactionAdaptionEventModel.RebuildEventStarting(fileId, timestamp),
              TransactionAdaptionEventModel.RebuildCompletedEvent(gwOutcome, fileId, timestamp),
              TransactionAdaptionEventModel.AnalysisCompletedEvent(fileId, timestamp),
              TransactionAdaptionEventModel.NcfsStartedEvent(fileId, timestamp),
              TransactionAdaptionEventModel.NcfsCompletedEvent(ncfsOutcome, fileId, timestamp),
            ];
    }

    toBuffer(): Buffer {
        const json = JSON.stringify(this);
        return Buffer.from(json);
    }
}