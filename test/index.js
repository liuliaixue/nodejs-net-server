const Client = require('../Client')

const client = new Client({ port: 16000 });

const sleep = (t) => new Promise(r => setTimeout(() => r(), t))

describe('api test', async () => {
  it('send several json string', async () => {
    let user1 = {
      name: 'alan', age: '12'
    }
    let user2 = {
      name: 'bob', age: 33
    }
    let user3 = {
      name: 'Cally', age: 30
    }

    client.writeString(JSON.stringify(user1))
    await sleep(100)
    client.writeString(JSON.stringify(user2))
    await sleep(100)
    client.writeString(JSON.stringify(user3))
    await sleep(100)
  })

  it('send json', async () => {

    client.writeJson({ time: new Date() })
    await sleep(100)
  });


  it('sperate one string into several frame', async () => {
    let user1 = {
      name: 'data1', index: 1
    }
    const data1 = JSON.stringify(user1)
    let buf1 = Buffer.alloc(4);
    buf1.writeUInt32LE(data1.length);
    client.write(buf1)
    client.write(data1)

    //data 2
    let user2 = {
      name: 'data2',
      user: 'b',
      age: 33
    }
    const data2 = JSON.stringify(user2)
    var buf2 = Buffer.alloc(4);
    buf2.writeUInt32LE(data2.length);
    client.write(buf2)

    const data2Array = [
      data2.slice(0, 1),
      data2.slice(1, data2.length)
    ]
    client.write(data2Array[0])
    await sleep(100)
    client.write(data2Array[1])
    await sleep(100)


    let user = {
      name: 'Cally',
      age: 30
    }
    const data = JSON.stringify(user)
    const buf = Buffer.alloc(4);
    buf.writeUInt32LE(data.length);
    client.write(buf)

    const dataArray = [
      data.slice(0, 1),
      data.slice(1, data.length)
    ]
    client.write(dataArray[0])
    await sleep(100)
    client.write(dataArray[1])
  });

  after(() => {
    // console.log('all test checked')
    process.exit()
  })
})
