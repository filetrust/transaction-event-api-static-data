import { ShareDirectoryClient } from "@azure/storage-file-share";

export async function createDirectoryTree(directoryClient: ShareDirectoryClient, tree: string): Promise<ShareDirectoryClient> {
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
  
export async function deleteEverything(directoryClient: ShareDirectoryClient) {
    let dirIter = directoryClient.listFilesAndDirectories();
    for await(const item of dirIter) {
      if (item.kind === "directory") {
        var subDirectory = directoryClient.getDirectoryClient(item.name);
        await deleteEverything(subDirectory);
        await subDirectory.deleteIfExists();
      } else {
        console.log(`Deleting ${directoryClient.path}/${item.name}`);
        await directoryClient.deleteFile(item.name);
      }
    }
  }
  
  export async function listEverything(directoryClient: ShareDirectoryClient, currentDirectoryPath: string) {
    let dirIter =  directoryClient.listFilesAndDirectories();
    for await(const item of dirIter) {
      if (item.kind === "directory") {
        console.log(`$directory\t: ${currentDirectoryPath + "/" + item.name}`);
        var subDirectory = directoryClient.getDirectoryClient(item.name);
        await listEverything(subDirectory, currentDirectoryPath + "/" + item.name);
      } else {
        console.log(`file\t: ${item.name}`);
      }
    }
  }
  