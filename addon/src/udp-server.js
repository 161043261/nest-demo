const { KCP } = require('./kcp-node.js');
const dgram = require('node:dgram');

// console.log(KCP);
const server = dgram.createSocket('udp4');
const clients = {};
const delay = 200;

function outputCallback(msg, length, context /**{ port, address } */) {
  const { port, address } = context;
  const offset = 0;
  server.send(msg, offset, length, port, address);
}

server.on('error', (err) => {
  console.error('Server error', err.stack);
  server.close();
});

server.on('message', (buf, rinfo) => {
  const { address, port } = rinfo;
  const clientKey = `${address}-${port}`; // IPv4, IPv6
  if (!clients[clientKey]) {
    const context = {
      address,
      port,
    };
    const kcpObject = new KCP(123, context);
    kcpObject.stream(1);
    kcpObject.nodelay(0, delay, 0, 0);
    kcpObject.output(outputCallback);
    clients[clientKey] = kcpObject;
  }

  const kcpObject = clients[clientKey];
  kcpObject.input(buf);
  const recv = kcpObject.recv();
  if (recv) {
    const recvStr = recv.toString();
    const { address, port } = kcpObject.context();
    console.log(`[server] receive ${recvStr} from ${address}:${port}`);
    kcpObject.send(`echo${recvStr}`);
  }
});

server.on('listening', () => {
  const { address, port } = server.address();
  console.log(`[server] ${address}:${port}`);
  setInterval(() => {
    for (const clientKey in clients) {
      const kcpObject = clients[clientKey];
      kcpObject.update(Date.now());
    }
  }, delay);
});

server.bind(41234);
