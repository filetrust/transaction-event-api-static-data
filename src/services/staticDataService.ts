import AzureFileShareService from "./azureFileShareService";
import { v4 as Guid } from "uuid";
import transactionAdaptionEventMetadataFile from "../models/transactionAdaptionEventMetadataFile";
import analysisReport from "../models/analysisReport";

export default class StaticDataService {
    dateRangeStart: Date;
    dateRangeEnd: Date;
    numberOfFilesPerHour: number;
    shareService: AzureFileShareService;

    constructor(shareService: AzureFileShareService, dateRangeStart: string, dateRangeEnd: string, numberOfFilesPerHour: number) {
        this.shareService = shareService;
        this.dateRangeStart = new Date(dateRangeStart);
        this.dateRangeEnd = new Date(dateRangeEnd);
        this.numberOfFilesPerHour = numberOfFilesPerHour;
    }

    async Generate(): Promise<void> {
        let currentHourDate = new Date(this.dateRangeStart);
        do {
            const nextHour = currentHourDate.getTime() + (1 * 60 * 60 * 1000);
            const currentHourTimestamp = new Date(currentHourDate).getTime();

            for (let i = 0; i < this.numberOfFilesPerHour; i++) {
                const timestamp = new Date(Math.random() * (nextHour - currentHourTimestamp) + currentHourTimestamp);
                const fileId = Guid()
                const fileDirectory = this.getFileDirectory(timestamp, fileId);

                console.log(`Generating file for timestamp '${timestamp}' ${fileDirectory}`);
                
                await this.shareService.uploadFile(fileDirectory, "metadata.json", new transactionAdaptionEventMetadataFile(fileId, timestamp).toBuffer());
                await this.shareService.uploadFile(fileDirectory, "report.json", new analysisReport().toBuffer());
            }

            currentHourDate.setTime(nextHour);
        } while (currentHourDate < this.dateRangeEnd);
    }

    private getFileDirectory(timestamp: Date, fileId: string) {
        return [
            timestamp.getFullYear().toString(),
            (timestamp.getMonth() + 1).toString(),
            timestamp.getDate().toString(),
            timestamp.getHours().toString(),
            fileId
        ].join("/");
    }
}