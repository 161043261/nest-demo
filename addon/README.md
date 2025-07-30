# addon

```bash
clang-format -i -style=google ./include/*.h ./include/*cc

pnpm add node-gyp -g

node-gyp configure
node-gyp build

pnpm install

node ./src/udpServer.js
node ./src/udpClient.js
```
