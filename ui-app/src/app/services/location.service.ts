import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Loc, Thought} from '../models/thought';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocation(): string {
    return localStorage.getItem('current_location');
  }

  setLocation(loc: Loc): void {
    localStorage.setItem('current_location', JSON.stringify(loc));
  }

  getThoughts(): Observable<any> {
    return this.http.get('http://localhost:3000/thoughts');
    // localStorage.getItem('thoughts');
    // return {'123a': {thought: 'hi', loc: {lat: '1', long: '1'}} as Thought};
  }

  addThought(thought: Thought): Observable<any> {
    // todo - add this to localstorage and map
    return this.http.post('http://localhost:3000/thought', thought, {headers: {'content-type': 'application/json'}});
  }

  deleteThoughts(): Observable<any> {
    return this.http.delete('http://localhost:3000/thoughts', {headers: {'content-type': 'application/json'}});
  }
}
