import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly locationKey = 'current_location';

  constructor() { }

  static accuracyConversion(accuracy: number): number {
    if (accuracy < 100) {
      return 100;
    }
    if (accuracy > 1000) {
      return 1000;
    }
    return accuracy;
  }

  getLocation(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(this.locationKey)) {
        resolve(JSON.parse(localStorage.getItem(this.locationKey)) as Position);
      } else {
        const options = {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position: Position) => {
              // this.setLocation(position);
              resolve(position);
            },
            (err: PositionError) => reject(err),
            options
          );
        } else {
          reject();
        }
      }
    });
  }

  setLocation(position: Position): void {
    console.log(JSON.stringify(position));
    localStorage.setItem(this.locationKey, JSON.stringify(position));
  }
}
