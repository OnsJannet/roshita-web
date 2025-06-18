// hooks/useNotificationWebSocket.ts
import { useEffect, useState, useCallback } from 'react'

interface WebSocketMessage {
  // Define your message structure here
  [key: string]: any
}

export function useNotificationWebSocket(userId: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const connect = useCallback(() => {
    if (!userId) return

    const wsUrl = `${window.location.origin.replace(/^http/, 'ws')}/api/ws?userId=${userId}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      setIsConnected(true)
      console.log('Connected to WebSocket proxy')
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage
        setMessages(prev => [...prev, message])
      } catch (err) {
        console.error('Error parsing WebSocket message:', err)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      console.log('Disconnected from WebSocket proxy')
      setTimeout(connect, 5000) // Reconnect after 5 seconds
    }

    ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error)
      ws.close()
    }

    setSocket(ws)

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
    }
  }, [userId])

  useEffect(() => {
    const cleanup = connect()
    return () => {
      cleanup?.()
      socket?.close()
    }
  }, [connect])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    } else {
      console.error('Cannot send message - WebSocket not connected')
    }
  }, [socket])

  return { messages, isConnected, sendMessage }
}