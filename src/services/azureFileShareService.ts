import { ShareClient, ShareDirectoryClient, ShareServiceClient, StorageSharedKeyCredential } from "@azure/storage-file-share";

const getNextPath = (directory: string, fileOrDirectory: string): string => {
  return directory == "" ? fileOrDirectory : `${directory}/${fileOrDirectory}`
}

export default class AzureFileShareService {
    shareClient: ShareClient;

    constructor (account: string, accountKey: string, share: string) {
      const credential = new StorageSharedKeyCredential(account, accountKey);
      const serviceClient = new ShareServiceClient(
        `https://${account}.file.core.windows.net`,
        credential
      );
      this.shareClient = serviceClient.getShareClient(share);
    }

    async createDirectoryTree(destinationDirectory: string, tree: string): Promise<void> {
      var parts = tree.split("/");
    
      let subDirectoryClient = this.shareClient.getDirectoryClient(destinationDirectory);
    
      for (let i = 0; i < parts.length; i++) {
        subDirectoryClient = subDirectoryClient.getDirectoryClient(parts[i]);
        await subDirectoryClient.createIfNotExists();
        if (!subDirectoryClient.exists()) {
          throw "Could not create tree " + tree;
        }
      }
    }
    
    async deleteEverything(directory: string) {
      const directoryClient = this.shareClient.getDirectoryClient(directory);
      let dirIter = directoryClient.listFilesAndDirectories();
      for await (const item of dirIter) {
        const nextPath = getNextPath(directory, item.name);
        if (item.kind === "directory") {
          var subDirectory = directoryClient.getDirectoryClient(item.name);
          await this.deleteEverything(nextPath);
          await subDirectory.deleteIfExists();
        } else {
          console.log(`Deleting ${nextPath}`);
          await directoryClient.deleteFile(item.name);
        }
      }
    }
    
    async listEverything(directory: string) {
      const directoryClient = this.shareClient.getDirectoryClient(directory);
      const dirIter = directoryClient.listFilesAndDirectories();
      for await (const item of dirIter) {
        const nextPath = getNextPath(directory, item.name);
        if (item.kind === "directory") {
          console.log(`$directory\t: ${nextPath}`);
          await this.listEverything(nextPath);
        } else {
          console.log(`file\t: ${item.name}`);
        }
      }
    }
    
    async uploadFile(directory: string, fileName: string, data: Buffer): Promise<void> {
      await this.createDirectoryTree("", directory);
      const directoryClient = this.shareClient.getDirectoryClient(directory);
      const { fileClient } = await directoryClient.createFile(fileName, 0);
      await fileClient.uploadData(data);
    }
}