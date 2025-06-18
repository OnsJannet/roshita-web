// types/websocket.d.ts
declare global {
  interface WebSocketMessageEvent extends Event {
    data: string;
  }

  interface WebSocketErrorEvent extends Event {
    error: any;
    message: string;
  }
}

export {};