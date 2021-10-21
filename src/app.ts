import "dotenv/config"
import { Server } from "socket.io";
import express from 'express';
import cors from "cors"
import http from 'http'
import { router } from "./routes"
/* Utiliza o protocolo de sockets pois encaixa melhor no objetivo desse projeto
uma conexão do tipo socket é estabelecida entre o servidor e o cliente e a qualquer momento
um pode mandar mensagens para o outro, ao invés de ser requisições Http do tipo request e response */

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

const serverHttp = http.createServer(app)
const io = new Server(serverHttp, {
    cors: { origin: '*' }
})

io.on('connection', socket => {
    console.log(`Usuário conectado no socket ${socket.id}`)
})
io.on('disconnect', socket => {
    console.log(`Usuário desconectado no socket ${socket.id}`)
})


const clientId = process.env.GITHUB_CLIENT_ID
app.get('/github', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}`)
})

app.get('/signin/callback', (req, res) => {
    const { code } = req.query;

    return res.json(code)
})

export { serverHttp, io }

