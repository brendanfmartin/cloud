import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  constructor(private socket: Socket) { }

  getThought(id: string): void {
    console.log('getting thought')
    this.socket.emit('getThought', id);
  }
}
