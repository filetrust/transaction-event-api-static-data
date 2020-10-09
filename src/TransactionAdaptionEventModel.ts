import { v4 as Guid } from "uuid";

export type eMode = 1 | 2 | 3;

export enum EventId {
    Unknown,
    NewDocument,
    FileTypeDetected,
    RebuildStarted,
    RebuildCompleted,
    AnalysisCompleted,
    NCFSStartedEvent,
    NCFSCompletedEvent
}

export enum FileType {
    Unknown = 0,
    FileIssues = 1,
    BufferIssues = 2,
    InternalIssues = 3,
    LicenseExpired = 4,
    PasswordProtectedOpcFile = 5,
    Pdf = 16,
    Doc = 17,
    Docx = 18,
    Ppt = 19,
    Pptx = 20,
    Xls = 21,
    Xlsx = 22,
    Png = 23,
    Jpeg = 24,
    Gif = 25,
    Emf = 26,
    Wmf = 27,
    Rtf = 28,
    Bmp = 29,
    Tiff = 30,
    // Pe = 31,
    // Macho = 32,
    Elf = 33,
    Mp4 = 34,
    Mp3 = 35,
    Mp2 = 36,
    Wav = 37,
    Mpg = 38
    // Coff =39
}

export function Create(
    eventId: EventId,
    fileId: string,
    timestamp: Date): TransactionAdaptionEventModel {
    const properties = {
        FileId: fileId,
        EventId: eventId.toString(),
        Timestamp: timestamp.toString(),
    };

    return new TransactionAdaptionEventModel(properties);
}

export enum GwOutcome {
    Replace,
    Unmodified,
    Failed
}

export enum NCFSOutcome {
    Relayed,
    Replaced
}

export enum RequestMode {
    Request,
    Response
}

export class TransactionAdaptionEventModel {
    Properties: { [key: string]: string; };

    constructor(properties: { [key: string]: string }) {
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
