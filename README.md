# transaction-event-api-static-data

## How to

### Run via CLI

- Install the npm package globally: ```npm i transaction-event-api-static-data-cli -g```
- To run the commands the entry point is ```eventctl```

### usage

Delete contents of a store
```eventctl -d -s transactions -a myaccount -k myaccountkey```

List contents of a store
```eventctl -l -s transactions -a myaccount -k myaccountkey```

Generate the static data
```eventctl -g -s transactions -a myaccount -k myaccountkey -ts 2020-01-01 -te 2021-01-01 -f 20```

### Start (VScode configuration)

- Create a VSCode launch config
- Use the following template

```
{
            "type": "node",
            "request": "launch",
            "name": "Generate Static Data",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}\\dist\\src\\index.js",
            "preLaunchTask": "tsc: build - tsconfig.json",
            "outFiles": [
                "${workspaceFolder}/dist/**/*.js"
            ],
            "args": [
                "-a", "[REPLACE ME]",
                "-s", "[REPLACE ME]",
                "-k", "[REPLACE ME]",
                "-ts", "[REPLACE ME]",
                "-te", "[REPLACE ME]",
                "-f", "[REPLACE ME]",
                "-g"
            ]
}
```
