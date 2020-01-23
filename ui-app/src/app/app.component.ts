import {Component, OnInit} from '@angular/core';
import {Loc, Thought} from './models/thought';
import {LocationService} from './services/location.service';
import {Subscription} from 'rxjs';
import {ThoughtService} from './services/thought.service';

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

  position: Position;

  constructor(private locationService: LocationService,
              private thoughtService: ThoughtService) {}

  ngOnInit() {
    this.getLocation();
  }

  newThought(): void {
    // this.getThoughts();
  }

  clearThoughts(): void {
    this.thoughtService.deleteThoughts().subscribe();
  }

  private buildMap(): void {

    if (this.map) {
      return;
    }

    // todo - dont build if built
    this.map = this.L.map('mapid').setView([
      this.position.coords.latitude,
      this.position.coords.longitude
    ], 15);

    this.L.tileLayer(this.url, {
      attribution: this.attribution,
      maxZoom: 20,
      id: 'mapbox/dark-v10',
      accessToken: this.access_token
    }).addTo(this.map);

    this.L.circle([
      this.position.coords.latitude,
      this.position.coords.longitude
    ], {
      color: '#596974',
      fillColor: '#596974',
      fillOpacity: 0.2,
      radius: LocationService.accuracyConversion(this.position.coords.accuracy)
    }).addTo(this.map);

    this.getThoughts();
  }

  private getThoughts(): void {

    console.log('getting thoughts');

    // todo - order of build map and get thoughts
    this.buildMap();

    this.localThoughts$ = this.thoughtService.getThoughts().subscribe(
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

    this.thoughtService.findCoffee(this.position).subscribe(
      (coffee: object[]) => {
        console.log('coffee', coffee);
        coffee.map(c => {
          console.log(c);
        })
      },
      (rej) => console.error(rej)
    );

  }

  private getLocation(): void {
    this.fetchingLocation = true;
    console.log('getting location')
    this.locationService.getLocation()
      .then((position: Position) => {
        console.log('getting position', position);
        this.position = position;
        this.fetchingLocation = false;
        this.buildMap();
      })
      .catch((err) => {
        alert('Failed to retrieve location in a timely manner.');
        console.error(err);
        this.fetchingLocation = false;
      });
  }
}
