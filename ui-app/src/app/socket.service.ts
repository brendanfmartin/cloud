import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  locationSet: Observable<any>  = this.socket.fromEvent<any>('locationSet');

  constructor(private socket: Socket) { }

  getThought(id: string): void {
    console.log('getting thought')
    this.socket.emit('getThought', id);
  }

  setLocation(location: string): void {
    this.socket.emit('setLocation', location);
  }


}
