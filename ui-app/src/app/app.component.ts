import {Component, OnInit} from '@angular/core';
import {Loc, Thought} from './models/thought';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  private readonly access_token = 'pk.eyJ1IjoiYnJlbmRhbmZtYXJ0aW4iLCJhIjoiY2s1M2JnbTV5MDZ0djNrcGh0cXN0d2Y2bSJ9.4JYMZDKVqdJS0dJA0USyJw';
  private readonly url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/1/1/0?access_token=${this.access_token}`;
  // tslint:disable-next-line:max-line-length
  private readonly attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  thoughts: object[] = [];

  mapContainer: any;
  mymap: any;

  L: any = window['L'];

  loc: Loc;

  ngOnInit() {
    this.getThoughts();
    this.getLocation();
  }

  newThought(): void {
    this.getThoughts();
  }

  clearThoughts(): void {
    localStorage.setItem('thoughts', undefined);
    this.getThoughts();
  }

  private getThoughts(): void {

    if (!this.mapContainer) {
      this.mymap = this.L.map('mapid').setView([51.505, -0.09], 13);
      this.mapContainer = this.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: this.attribution,
        maxZoom: 1,
        id: 'mapbox/streets-v11',
        accessToken: this.access_token
      }).addTo(this.mymap);
    }


    const localThoughts = localStorage.getItem('thoughts');
    try {
      this.thoughts = JSON.parse(localThoughts);
      if (!this.thoughts) {
        this.thoughts = [];
      }
    } catch (e) {
      this.thoughts = [];
    }

    this.thoughts.map((t: Thought) => {
      const marker = this.L.marker([t.loc.lat, t.loc.long]).addTo(this.mymap);
      marker.bindPopup(t.thought).openPopup();
    });
  }

  private getLocation(): void {
    console.log('getting location');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('location is', position);
          this.loc = {long: position.coords.longitude.toString(), lat: position.coords.latitude.toString()};
          localStorage.setItem('current_location', JSON.stringify(this.loc));
        },
        (err) => console.error(err),
        {
          enableHighAccuracy: false,
          maximumAge: 10000,
          timeout: 10000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}
