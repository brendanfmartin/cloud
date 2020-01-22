import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Loc, Thought} from '../models/thought';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly locationKey = 'current_location';

  constructor(private http: HttpClient) { }

  static accuracyConversion(accuracy: number): number {
    if (accuracy < 100) {
      return 100;
    }
    if (accuracy > 1000) {
      return 1000;
    }
    return accuracy;
  }

  getLocation(): string {
    if (localStorage.getItem(this.locationKey)) {
      return localStorage.getItem(this.locationKey);
    } else {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: Position) => this.handleLocation(position),
          (err: PositionError) => this.handleError(err),
          options
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    }
  }

  setLocation(loc: Loc): void {
    localStorage.setItem(this.locationKey, JSON.stringify(loc));
  }

  private handleLocation(position: Position): void {
    console.log('string location');
    console.log(position.coords);
    const loc = {
      lat: position.coords.latitude.toString(),
      long: position.coords.longitude.toString(),
      accuracy: LocationService.accuracyConversion(position.coords.accuracy)
    };
    this.setLocation(loc);
  }

  private handleError(err: PositionError): void {
    alert(`Error getting location, code: ${err.code}, message: ${err.message}`);
    console.error(err.message);
  }
}
