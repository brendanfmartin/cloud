import {Component, OnInit} from '@angular/core';
import {Loc, Thought} from './models/thought';
import {Circle, circle, icon, latLng, Layer, marker, tileLayer} from 'leaflet';
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
  private readonly url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/1/1/0?access_token=${this.access_token}`;
  // tslint:disable-next-line:max-line-length
  private readonly attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  thoughts: object[] = [];
  loc: Loc;
  localThoughts$: Subscription;

  layersControl: any;

  layers = [];
  myLayer: any[];
  markers: Layer[] = [];

  fetchingLocation: boolean;

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
    // todo - dont build if built

    this.options = {
      layers: [
        tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: this.attribution,
          maxZoom: 20,
          id: 'mapbox/streets-v11',
          accessToken: this.access_token
        })
      ],
      zoom: 16,
      center: latLng(
        JSON.parse(this.locationService.getLocation()).lat,
        JSON.parse(this.locationService.getLocation()).long
      )
    };

    this.myLayer = [
      circle([
        JSON.parse(this.locationService.getLocation()).lat,
        JSON.parse(this.locationService.getLocation()).long
      ], { radius: 50 })
      // marker([ JSON.parse(this.locationService.getLocation()).lat,
      //     JSON.parse(this.locationService.getLocation()).long ], {
      //   icon: icon({
      //     iconSize: [25, 41],
      //     iconAnchor: [13, 41],
      //     iconUrl: 'assets/marker-icon.png',
      //     shadowUrl: 'assets/marker-shadow.png'
      //   })
      // }).bindPopup('hello')
    ];

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
          this.layers.push(
            marker([
                t.loc.lat as any,
                t.loc.long as any
              ],
              {
              icon: icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
              })
            }).bindPopup('hello').openPopup()
          );
        });

        this.thoughts.map((t: Thought) => this.layers.push(
          // circle([
          //   t.loc.lat as any,
          //   t.loc.long as any
          // ], { radius: 100 })
        ));

      }
    );
  }

  private handleLocation(position: Position): void {
    this.fetchingLocation = false;
    this.loc = {lat: position.coords.latitude.toString(), long: position.coords.longitude.toString()};
    this.locationService.setLocation(this.loc);
    this.getThoughts();
  }

  private handleError(err: PositionError): void {
    this.fetchingLocation = false;
    this.loc = {lat: '75.1652', long: '39.9526'};
    this.locationService.setLocation(this.loc);
    alert(`Error getting location, code: ${err.code}, message: ${err.message}`);
    console.error(err.message);
    this.getThoughts();
  }

  private getLocation(): void {
    // get from cache if in cache

    if (this.locationService.getLocation()) {
      console.log('getting stored location', this.locationService.getLocation());
      this.getThoughts();
    } else {
      this.fetchingLocation = true;
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
}
