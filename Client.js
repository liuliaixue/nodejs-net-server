
// client .js
const net = require('net')
const EventEmitter = require('events')

const HEAD_LENGTH = 4
// const msgpack = requir();

class Client extends EventEmitter {
  constructor(props) {
    super()
    this.buffers = [];
    console.log(props)
    this.socket = net.createConnection(props);
    this.socket.on('connect', () => this.emit('connect'))
    this.socket.on('data', buf => { this.buffers.push(buf); this.onData() });
    this.socket.on('error', err => console.log(err))
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
  writeString(string) {
    let length = Buffer.alloc(4);
    length.writeUInt32LE(string.length);
    this.socket.write(length)
    this.socket.write(string)
  }
  writeJson(json) {
    const data = JSON.stringify(json)
    let length = Buffer.alloc(4);
    length.writeUInt32LE(data.length);
    this.socket.write(length)
    this.socket.write(data)
  }
  // no data length in this method
  write(buffer) {
    this.socket.write(buffer)
  }
}


module.exports = Client