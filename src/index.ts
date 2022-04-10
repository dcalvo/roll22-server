import express from "express"
import http from "http"
import { WebSocketServer } from "ws"
import setupWebsocket from "./sockets"

const app = express()
const port = process.env.PORT || 3000

//initialize a simple http server
const server = http.createServer(app)

//initialize the WebSocket server instance
const wss = new WebSocketServer({ server })

// set up WebSocket connections
wss.on("connection", setupWebsocket)

//start our server
server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
