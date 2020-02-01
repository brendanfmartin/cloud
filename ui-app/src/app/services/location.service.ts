import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  private readonly permissionKey = 'location_permission';
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

  get locationPermission(): boolean {
    return localStorage.getItem(this.permissionKey) === 'true';
  }

  set locationPermission(permission: boolean) {
    permission ? localStorage.setItem(this.permissionKey, 'true') : null;
  }

  getLocation(): Promise<Position> {
    return new Promise((resolve, reject) => {
      const localLocation = JSON.parse(localStorage.getItem(this.locationKey));
      console.log(new Date(localLocation.timestamp).setMinutes(-5) < new Date().setMinutes(-5));
      if (localLocation && new Date(localLocation.timestamp).setMinutes(-5) > new Date().setMinutes(-5)) {
        resolve(JSON.parse(localStorage.getItem(this.locationKey)) as Position);
      } else {
        const options = {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000,
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position: Position) => {
              this.setLocation(position);
              resolve(position);
            },
            (err: PositionError) => reject(err),
            options,
          );
        } else {
          reject();
        }
      }
    });
  }

  setLocation(position: Position): void {
    localStorage.setItem(this.locationKey, JSON.stringify(this.convertPositionToObject(position)));
  }

  private convertPositionToObject(position: Position): object {
    return {
      timestamp: position.timestamp,
      coords: {
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: position.coords.speed,
      },
    };
  }
}
