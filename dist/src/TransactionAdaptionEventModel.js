"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionAdaptionEventModel = exports.RequestMode = exports.NCFSOutcome = exports.GwOutcome = exports.Create = exports.FileType = exports.EventId = void 0;
const uuid_1 = require("uuid");
var EventId;
(function (EventId) {
    EventId[EventId["Unknown"] = 0] = "Unknown";
    EventId[EventId["NewDocument"] = 1] = "NewDocument";
    EventId[EventId["FileTypeDetected"] = 2] = "FileTypeDetected";
    EventId[EventId["RebuildStarted"] = 3] = "RebuildStarted";
    EventId[EventId["RebuildCompleted"] = 4] = "RebuildCompleted";
    EventId[EventId["AnalysisCompleted"] = 5] = "AnalysisCompleted";
    EventId[EventId["NCFSStartedEvent"] = 6] = "NCFSStartedEvent";
    EventId[EventId["NCFSCompletedEvent"] = 7] = "NCFSCompletedEvent";
})(EventId = exports.EventId || (exports.EventId = {}));
var FileType;
(function (FileType) {
    FileType[FileType["Unknown"] = 0] = "Unknown";
    FileType[FileType["FileIssues"] = 1] = "FileIssues";
    FileType[FileType["BufferIssues"] = 2] = "BufferIssues";
    FileType[FileType["InternalIssues"] = 3] = "InternalIssues";
    FileType[FileType["LicenseExpired"] = 4] = "LicenseExpired";
    FileType[FileType["PasswordProtectedOpcFile"] = 5] = "PasswordProtectedOpcFile";
    FileType[FileType["Pdf"] = 16] = "Pdf";
    FileType[FileType["Doc"] = 17] = "Doc";
    FileType[FileType["Docx"] = 18] = "Docx";
    FileType[FileType["Ppt"] = 19] = "Ppt";
    FileType[FileType["Pptx"] = 20] = "Pptx";
    FileType[FileType["Xls"] = 21] = "Xls";
    FileType[FileType["Xlsx"] = 22] = "Xlsx";
    FileType[FileType["Png"] = 23] = "Png";
    FileType[FileType["Jpeg"] = 24] = "Jpeg";
    FileType[FileType["Gif"] = 25] = "Gif";
    FileType[FileType["Emf"] = 26] = "Emf";
    FileType[FileType["Wmf"] = 27] = "Wmf";
    FileType[FileType["Rtf"] = 28] = "Rtf";
    FileType[FileType["Bmp"] = 29] = "Bmp";
    FileType[FileType["Tiff"] = 30] = "Tiff";
    // Pe = 31,
    // Macho = 32,
    FileType[FileType["Elf"] = 33] = "Elf";
    FileType[FileType["Mp4"] = 34] = "Mp4";
    FileType[FileType["Mp3"] = 35] = "Mp3";
    FileType[FileType["Mp2"] = 36] = "Mp2";
    FileType[FileType["Wav"] = 37] = "Wav";
    FileType[FileType["Mpg"] = 38] = "Mpg";
    // Coff =39
})(FileType = exports.FileType || (exports.FileType = {}));
function Create(eventId, fileId, timestamp) {
    const properties = {
        FileId: fileId,
        EventId: eventId.toString(),
        Timestamp: timestamp.toString(),
    };
    return new TransactionAdaptionEventModel(properties);
}
exports.Create = Create;
var GwOutcome;
(function (GwOutcome) {
    GwOutcome[GwOutcome["Replace"] = 0] = "Replace";
    GwOutcome[GwOutcome["Unmodified"] = 1] = "Unmodified";
    GwOutcome[GwOutcome["Failed"] = 2] = "Failed";
})(GwOutcome = exports.GwOutcome || (exports.GwOutcome = {}));
var NCFSOutcome;
(function (NCFSOutcome) {
    NCFSOutcome[NCFSOutcome["Relayed"] = 0] = "Relayed";
    NCFSOutcome[NCFSOutcome["Replaced"] = 1] = "Replaced";
})(NCFSOutcome = exports.NCFSOutcome || (exports.NCFSOutcome = {}));
var RequestMode;
(function (RequestMode) {
    RequestMode[RequestMode["Request"] = 0] = "Request";
    RequestMode[RequestMode["Response"] = 1] = "Response";
})(RequestMode = exports.RequestMode || (exports.RequestMode = {}));
class TransactionAdaptionEventModel {
    constructor(properties) {
        this.Properties = properties;
    }
    static NewDocumentEvent(policyId = null, mode = null, fileId = null, timestamp = null) {
        var model = Create(EventId.NewDocument, fileId, timestamp);
        model.Properties["PolicyId"] = policyId !== null && policyId !== void 0 ? policyId : uuid_1.v4();
        model.Properties["RequestMode"] = (mode !== null && mode !== void 0 ? mode : RequestMode.Response).toString();
        return model;
    }
    static FileTypeDetectedEvent(fileType, fileId = null, timestamp = null) {
        var model = Create(EventId.FileTypeDetected, fileId, timestamp);
        model.Properties["FileType"] = fileType.toString();
        return model;
    }
    static RebuildEventStarting(fileId = null, timestamp = null) {
        var model = Create(EventId.RebuildStarted, fileId, timestamp);
        return model;
    }
    static RebuildCompletedEvent(gwOutcome, fileId = null, timestamp = null) {
        var model = Create(EventId.RebuildCompleted, fileId, timestamp);
        model.Properties["GwOutcome"] = gwOutcome.toString();
        return model;
    }
    static AnalysisCompletedEvent(fileId = null, timestamp = null) {
        var model = Create(EventId.AnalysisCompleted, fileId, timestamp);
        return model;
    }
    static NcfsStartedEvent(fileId = null, timestamp = null) {
        var model = Create(EventId.NCFSStartedEvent, fileId, timestamp);
        return model;
    }
    static NcfsCompletedEvent(ncfsOutcome, fileId = null, timestamp = null) {
        var model = Create(EventId.NCFSCompletedEvent, fileId, timestamp);
        model.Properties["NCFSOutcome"] = ncfsOutcome.toString();
        return model;
    }
}
exports.TransactionAdaptionEventModel = TransactionAdaptionEventModel;
//# sourceMappingURL=TransactionAdaptionEventModel.js.map