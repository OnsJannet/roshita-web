// pages/api/ws/[...path].ts
import { NextApiRequest, NextApiResponse } from 'next'
import WebSocket from 'ws'
import { IncomingMessage } from 'http'

// This keeps our WebSocket server instance
let wss: WebSocket.Server | null = null
const backendConnections = new Map<string, WebSocket>()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!wss) {
    // Initialize WebSocket server if it doesn't exist
    wss = new WebSocket.Server({ noServer: true })

    wss.on('connection', (clientWs: WebSocket, req: IncomingMessage) => {
      const urlParams = new URLSearchParams(req.url?.split('?')[1])
      const userId = urlParams.get('userId')
      
      if (!userId) {
        clientWs.close(4000, 'UserId required')
        return
      }

      const backendWs = new WebSocket(`wss://www.test-roshita.net:8080/ws/notifications/patient/${userId}`)

      backendConnections.set(userId, backendWs)

      // Forward messages from backend to client
      backendWs.on('message', (data: WebSocket.Data) => {
        if (clientWs.readyState === WebSocket.OPEN) {
          clientWs.send(data.toString())
        }
      })

      // Forward messages from client to backend (if needed)
      clientWs.on('message', (data: WebSocket.Data) => {
        if (backendWs.readyState === WebSocket.OPEN) {
          backendWs.send(data.toString())
        }
      })

      // Cleanup connections
      const cleanup = () => {
        backendWs.close()
        backendConnections.delete(userId)
      }

      clientWs.on('close', cleanup)
      backendWs.on('close', cleanup)
      backendWs.on('error', (err: Error) => {
        console.error('Backend WS error:', err)
        cleanup()
      })
    })
  }

  // Check if the request is a WebSocket upgrade request
  if (!req.socket || !req.socket.remoteAddress) {
    res.status(400).json({ error: 'Not a WebSocket request' })
    return
  }

  // Handle the WebSocket upgrade
  if (wss) {
    wss.handleUpgrade(
      req as unknown as IncomingMessage,
      req.socket,
      Buffer.alloc(0),
      (ws) => {
        wss!.emit('connection', ws, req)
      }
    )
  }

  res.status(101).end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}