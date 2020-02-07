import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  private readonly access_token = 'pk.eyJ1IjoiYnJlbmRhbmZtYXJ0aW4iLCJhIjoiY2s1M2JnbTV5MDZ0djNrcGh0cXN0d2Y2bSJ9.4JYMZDKVqdJS0dJA0USyJw';

  private readonly url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

  // tslint:disable-next-line:max-line-length
  private readonly attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  map: any;
  L = window['L'];
  position: Position;

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.buildMap();
  }

  private buildMap(): void {
    if (this.map) {
      return;
    }

    this.map = this.L.map('mapid').setView([
      this.position.coords.latitude,
      this.position.coords.longitude,
    ], 15);

    this.L.tileLayer(this.url, {
      attribution: this.attribution,
      maxZoom: 20,
      id: 'mapbox/dark-v10',
      accessToken: this.access_token,
    }).addTo(this.map);

    this.drawLocation();
    this.listenToMove();
  }

  private drawLocation(): void {
    this.L.circle([
      this.position.coords.latitude,
      this.position.coords.longitude,
    ], {
      color: '#596974',
      fillColor: '#596974',
      fillOpacity: 0.2,
      radius: LocationService.accuracyConversion(this.position.coords.accuracy),
    }).addTo(this.map);
  }

  private listenToMove(): void {
    this.map.on('moveend', () => this.setLocationSocket());
  }

  private setLocationSocket(): void {
    // {
    //   "_southWest": {
    //   "lat": 39.95593818515614,
    //     "lng": -75.18158912658693
    // },
    //   "_northEast": {
    //   "lat": 39.98264473554439,
    //     "lng": -75.16549587249757
    // }
    // }
    console.log(this.map.getBounds());
    this.socketService.setLocation(JSON.stringify(this.map.getBounds()));
    this.socketService.locationSet.subscribe((res) => console.log('hey i got an emited thing\n', res))
  }

}
