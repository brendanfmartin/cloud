import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Loc, Thought} from '../models/thought';

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

  getThoughts(): any {
    localStorage.getItem('thoughts');
    return {'123a': {thought: 'hi', loc: {lat: '1', long: '1'}} as Thought};
  }

  addThought(): any {

  }
}
