import { test } from "./game"
import Message from "./models/message"

export default function setupWebsocket(ws: WebSocket) {
  ws.onmessage = (event: MessageEvent) => {
    let message: Message
    try {
      message = JSON.parse(event.data)
    } catch (error) {
      ws.send(JSON.stringify({ error: "Failed to parse message object" }))
      return
    }
    messageHandler(message)
  }
}

function messageHandler(message: Message) {
  const { action, payload } = message
  switch (action) {
    case "test":
      test(payload)
      break
    default:
      console.log(action, payload)
      break
  }
}
