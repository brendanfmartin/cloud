import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Thought } from '../models/thought';

@Injectable({
  providedIn: 'root',
})
export class ThoughtService {
  constructor(private http: HttpClient) { }

  getThoughts(): Observable<any> {
    return this.http.get('http://localhost:3000/thoughts');
  }

  findCoffee(position: Position, radius?: number): Observable<any> {
    return this.http.post('http://localhost:3000/coffee',
      { latitude: position.coords.latitude, longitude: position.coords.longitude, radius });
  }

  addThought(thought: Thought): Observable<any> {
    thought.loc.lat = (parseFloat(thought.loc.lat) + Math.random() / 100).toString();
    thought.loc.long = (parseFloat(thought.loc.long) + Math.random() / 100).toString();

    // todo - add this to localstorage and map
    return this.http.post('http://localhost:3000/thought', thought, { headers: { 'content-type': 'application/json' } });
  }

  deleteThoughts(): Observable<any> {
    return this.http.delete('http://localhost:3000/thoughts', { headers: { 'content-type': 'application/json' } });
  }
}
