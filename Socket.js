
// client .js
const net = require('net')
const EventEmitter = require('events')

const HEAD_LENGTH = 4
// const msgpack = requir();

class Socket extends EventEmitter {
  constructor(socket) {
    super()
    this.buffers = [];
    this.socket = socket;
    this.isAuthorized = false;
    this.socket.on('data', buf => {
      this.buffers.push(buf);
      this.onData()
    });
    this.socket.on('close', () => { })
    this.socket.on('error', () => { })
    this.socket.on('timeout', () => { })
  }

  onData() {
    const data = this.buffers;
    if (data[0].length > 4) {
      // get full header
      const datalen = data[0].slice(0, 4).readUInt32LE()

      if (data[0].length >= datalen + 4) {

        const data1 = data[0].slice(4, 4 + datalen)
        this.onMsg(data1)
        const resetBuf = data[0].slice(4 + datalen, data[0].length)
        data[0] = resetBuf;
        this.onData(data)

      } else {
        if (data.length > 1) {
          const firstBuf = data.shift();
          data[0] = Buffer.concat([firstBuf, data[0]]);
          this.onData(data)
        }
      }

    } else if (data.length > 1) {

      const firstBuf = data.shift();
      data[0] = Buffer.concat([firstBuf, data[0]]);
      this.onData(data)
    }
  }
  onMsg(buffer) {
    const string = buffer.toString();
    try {
      console.log('@@@@@@@', JSON.parse(string));
      this.emit('message', JSON.parse(string));
    } catch (e) {

    }
  }
  send(message) {
    console.log('send message')
  }
  sendData(buffer) {
    console.log('send buffer')
  }
}


module.exports = Socket