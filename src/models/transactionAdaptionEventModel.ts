import { v4 as Guid } from "uuid";
import { EventId } from "../enums/EventId";
import { FileType } from "../enums/FileType";
import { GwOutcome } from "../enums/GwOutcome";
import { NCFSOutcome } from "../enums/NCFSOutcome";
import { RequestMode } from "../enums/RequestMode";

export function Create(
    eventId: EventId,
    fileId: string,
    timestamp: Date): TransactionAdaptionEventModel {
    const properties = {
      FileId: fileId,
      EventId: eventId.toString(),
      Timestamp: timestamp.toUTCString(),
    };
  
    return new TransactionAdaptionEventModel(properties);
  }
  
export class TransactionAdaptionEventModel {
  Properties: { [key: string]: string; };

  constructor(properties: { [key: string]: string; }) {
    this.Properties = properties;
  }

  static NewDocumentEvent(
    policyId: string = null,
    mode: RequestMode = null,
    fileId: string = null,
    timestamp: Date = null): TransactionAdaptionEventModel {
    var model = Create(EventId.NewDocument, fileId, timestamp);
    model.Properties["PolicyId"] = policyId ?? Guid();
    model.Properties["RequestMode"] = (mode ?? RequestMode.Response).toString();
    return model;
  }

  static FileTypeDetectedEvent(
    fileType: FileType,
    fileId: string = null,
    timestamp: Date = null): TransactionAdaptionEventModel {
    var model = Create(EventId.FileTypeDetected, fileId, timestamp);
    model.Properties["FileType"] = fileType.toString();
    return model;
  }

  static RebuildEventStarting(
    fileId: string = null,
    timestamp: Date = null) {
    var model = Create(EventId.RebuildStarted, fileId, timestamp);
    return model;
  }

  static RebuildCompletedEvent(
    gwOutcome: GwOutcome,
    fileId: string = null,
    timestamp: Date = null) {
    var model = Create(EventId.RebuildCompleted, fileId, timestamp);
    model.Properties["GwOutcome"] = gwOutcome.toString();
    return model;
  }

  static AnalysisCompletedEvent(
    fileId: string = null,
    timestamp: Date = null) {
    var model = Create(EventId.AnalysisCompleted, fileId, timestamp);
    return model;
  }

  static NcfsStartedEvent(
    fileId: string = null,
    timestamp: Date = null) {
    var model = Create(EventId.NCFSStartedEvent, fileId, timestamp);
    return model;
  }

  static NcfsCompletedEvent(
    ncfsOutcome: NCFSOutcome,
    fileId: string = null,
    timestamp: Date = null) {
    var model = Create(EventId.NCFSCompletedEvent, fileId, timestamp);
    model.Properties["NCFSOutcome"] = ncfsOutcome.toString();
    return model;
  }
}
