import { io, Socket } from 'socket.io-client'

class SocketHanlder {
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

const socketHandler = new SocketHanlder()

export default socketHandler
