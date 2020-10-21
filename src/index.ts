#!/usr/bin/env node
import { program } from "commander";
import AzureFileShareService from "./services/azureFileShareService";
import StaticDataService from "./services/staticDataService";

const start = () => {
  program
    .requiredOption("-s, --share <share>", "Share Name - default is 'transactions'", "transactions")
    .requiredOption("-a, --account <account>", "Azure Storage Account")
    .requiredOption("-k, --key <key>", "Azure Storage Account Key")

  if (process.argv.includes("-l")) {
    program
      .requiredOption("-l, --list", "If set, lists the contents of a share to console")
      .parse(process.argv);
  }
  else if (process.argv.includes("-g")) {
    program
      .requiredOption("-g, --generate", "If set, generates the contents of a share")
      .requiredOption("-f, --files <files>", "Number of events to generate in each hour folder")
      .requiredOption("-ts, --start <start>", "Hour of the date to start generating from")
      .requiredOption("-te, --end <end>", "Hour of the date to stop generating from")
      .helpOption("-h")
      .parse(process.argv);
  }
  else if (process.argv.includes("-d")) {
    program
      .requiredOption("-d, --delete", "If set, deletes the contents of a share")
      .parse(process.argv);
  }
  else {
    console.log("Incorrect usage. View individual commands for more information.")
    console.log("eventctl -d -s transactions -a myaccount -k myaccountkey")
    console.log("eventctl -l -s transactions -a myaccount -k myaccountkey")
    console.log("eventctl -g -s transactions -a myaccount -k myaccountkey -ts 2020-01-01 te 2021-01-01 -f 20")
    return;
  }

  const azureFileShareService = new AzureFileShareService(program.account, program.key, program.share);

  if (program.generate) {
    const staticDataService = new StaticDataService(azureFileShareService, program.start, program.end, parseInt(program.files));

    staticDataService.Generate().then(() => {
      console.log("Generation has completed.");
    }, reason => {
      throw reason;
    });
  }

  if (program.delete) {
    azureFileShareService.deleteEverything("").then(() => {
      console.log("Deletion has reached completion.")
    });
  }

  if (program.list) {
    azureFileShareService.listEverything("").then(() => {
      console.log("List operation complete.")
    });
  }
}

start();