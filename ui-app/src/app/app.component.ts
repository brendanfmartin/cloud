import {Component, OnInit} from '@angular/core';
import {Loc, Thought} from './models/thought';
import { latLng, tileLayer } from 'leaflet';
import {LocationService} from './services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  options;

  // tslint:disable-next-line:variable-name
  private readonly access_token = 'pk.eyJ1IjoiYnJlbmRhbmZtYXJ0aW4iLCJhIjoiY2s1M2JnbTV5MDZ0djNrcGh0cXN0d2Y2bSJ9.4JYMZDKVqdJS0dJA0USyJw';
  private readonly url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/1/1/0?access_token=${this.access_token}`;
  // tslint:disable-next-line:max-line-length
  private readonly attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  thoughts: object[] = [];

  loc: Loc;

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.getLocation();
  }

  newThought(): void {
    this.getThoughts();
  }

  clearThoughts(): void {
    localStorage.setItem('thoughts', undefined);
    this.getThoughts();
  }

  private buildMap(): void {
    ////   this.mapContainer = this.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //     //     attribution: this.attribution,
    //     //     maxZoom: 20,
    //     //     id: 'mapbox/streets-v11',
    //     //     accessToken: this.access_token

    console.log('building map');


    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: latLng(
        JSON.parse(this.locationService.getLocation()).lat,
        JSON.parse(this.locationService.getLocation()).long
      )
    };

  }

  private getThoughts(): void {
    console.log('getting thoughts');

    // todo - order of build map and get thoughts
    this.buildMap();

    const localThoughts = this.locationService.getThoughts();
    try {
      this.thoughts = JSON.parse(localThoughts);
      if (!this.thoughts) {
        this.thoughts = [];
      }
    } catch (e) {
      this.thoughts = [];
    }

    this.thoughts.map((t: Thought) => {
      // const marker = this.L.marker([t.loc.lat, t.loc.long]).addTo(this.mymap);
      // marker.bindPopup(t.thought).openPopup();
    });
  }

  private handleLocation(position: Position): void {
    this.loc = {long: position.coords.longitude.toString(), lat: position.coords.latitude.toString()};
    this.locationService.setLocation(this.loc);
    this.getThoughts();
  }

  private handleError(err: PositionError): void {
    alert(`Error getting location, code: ${err.code}, message: ${err.message}`);
    console.error(err.message);
  }

  private getLocation(): void {
    // get from cache if in cache

    if (this.locationService.getLocation()) {
      this.getThoughts();
    }

    const options = {
      enableHighAccuracy: false,
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
