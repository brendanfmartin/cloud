import {Component, OnInit} from '@angular/core';
import {Loc, Thought} from './models/thought';
import {circle, icon, latLng, Layer, marker, tileLayer} from 'leaflet';
import {LocationService} from './services/location.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  options;

  // tslint:disable-next-line:variable-name
  private readonly access_token = 'pk.eyJ1IjoiYnJlbmRhbmZtYXJ0aW4iLCJhIjoiY2s1M2JnbTV5MDZ0djNrcGh0cXN0d2Y2bSJ9.4JYMZDKVqdJS0dJA0USyJw';
  private readonly url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
  // tslint:disable-next-line:max-line-length
  private readonly attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  thoughts: object[] = [];
  loc: Loc;
  localThoughts$: Subscription;

  fetchingLocation: boolean;

  L = window['L'];
  map: any;

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.getLocation();
  }

  newThought(): void {
    this.getThoughts();
  }

  clearThoughts(): void {
    this.locationService.deleteThoughts().subscribe();
  }

  private buildMap(): void {

    if (this.map) {
      return;
    }

    // todo - dont build if built
    this.map = this.L.map('mapid').setView([
      JSON.parse(this.locationService.getLocation()).lat,
      JSON.parse(this.locationService.getLocation()).long
    ], 15);

    this.L.tileLayer(this.url, {
      attribution: this.attribution,
      maxZoom: 20,
      id: 'mapbox/dark-v10',
      accessToken: this.access_token
    }).addTo(this.map);

    this.L.circle([
      JSON.parse(this.locationService.getLocation()).lat,
      JSON.parse(this.locationService.getLocation()).long
    ], {
      color: '#596974',
      fillColor: '#596974',
      fillOpacity: 0.2,
      radius: JSON.parse(this.locationService.getLocation()).accuracy * 10
    }).addTo(this.map);
  }

  private getThoughts(): void {

    console.log('getting thoughts');

    // todo - order of build map and get thoughts
    this.buildMap();

    this.localThoughts$ = this.locationService.getThoughts().subscribe(
      (res) => {
        this.thoughts = res;

        if (this.thoughts.length === 0) {
          return;
        }

        this.thoughts.map((t: Thought) => {
          this.L.marker([
            t.loc.lat,
            t.loc.long
          ]).addTo(this.map)
            .bindPopup(t.thought)
            .openPopup();
        });

      }
    );
  }

  private handleLocation(position: Position): void {
    this.fetchingLocation = false;
    this.loc = {
      lat: position.coords.latitude.toString(),
      long: position.coords.longitude.toString(),
      accuracy: position.coords.accuracy
    };
    this.locationService.setLocation(this.loc);
    this.getThoughts();
  }

  private handleError(err: PositionError): void {
    this.fetchingLocation = false;
    alert(`Error getting location, code: ${err.code}, message: ${err.message}`);
    console.error(err.message);;
  }

  private getLocation(): void {
    // get from cache if in cache

    if (this.locationService.getLocation()) {
      console.log('getting stored location', this.locationService.getLocation());
      this.getThoughts();
    } else {
      this.fetchingLocation = true;
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
}
