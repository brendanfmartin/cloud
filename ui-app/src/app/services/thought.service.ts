import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Thought } from '../models/thought';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ThoughtService {

  constructor(private http: HttpClient) { }

  getThoughts(): Observable<any> {
    return this.http.get('http://localhost:3000/thoughts');
    // localStorage.getItem('thoughts');
    // return {'123a': {thought: 'hi', loc: {lat: '1', long: '1'}} as Thought};
  }

  addThought(thought: Thought): Observable<any> {
    thought.loc.lat = (parseFloat(thought.loc.lat) + Math.random() / 100).toString();
    thought.loc.long = (parseFloat(thought.loc.long) + Math.random() / 100).toString();

    // todo - add this to localstorage and map
    return this.http.post('http://localhost:3000/thought', thought, {headers: {'content-type': 'application/json'}});
  }

  deleteThoughts(): Observable<any> {
    return this.http.delete('http://localhost:3000/thoughts', {headers: {'content-type': 'application/json'}});
  }
}
