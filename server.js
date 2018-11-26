const net = require('net');
const Socket = require('./Socket')

const server = net.createServer((sock) => {
  console.log(new Date())
  const socket = new Socket(sock);
})

server.listen({
  port: 16000
}, () => {
  console.log('opened server on', server.address());
});

