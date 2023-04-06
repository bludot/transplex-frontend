import { io, Socket } from 'socket.io-client'

class SocketHandler {
  private socket: Socket | any

  connect() {
    this.socket = io('http://localhost:1337', {
      autoConnect: true,
    })
  }

  getSocket() {
    if (!this.socket) {
      this.connect()
      return this.socket
    }
    return this.socket
  }
}

const socketHandler = new SocketHandler()

export default socketHandler
