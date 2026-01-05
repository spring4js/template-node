# 调试
``` json
        {
            "name": "Launch Program",
            "program": "${workspaceFolder}/src/main.ts",
            "request": "launch",
            "runtimeArgs": [
                "-r", "ts-node/register",
                "-r", "tsconfig-paths/register"
            ],
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        }
```