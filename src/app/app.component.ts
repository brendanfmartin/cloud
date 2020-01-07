import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly access_token = 'pk.eyJ1IjoiYnJlbmRhbmZtYXJ0aW4iLCJhIjoiY2s1M2JnbTV5MDZ0djNrcGh0cXN0d2Y2bSJ9.4JYMZDKVqdJS0dJA0USyJw';
  private readonly url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/1/1/0?access_token=${this.access_token}`;
  private readonly attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  thoughts: object[] = [];

  L: any = window['L'];

  ngOnInit() {
    this.getThougths();

    const mymap = this.L.map('mapid').setView([51.505, -0.09], 13);
    this.L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: this.attribution,
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: this.access_token
    }).addTo(mymap);

    const marker = this.L.marker([51.5, -0.09]).addTo(mymap);
  }

  newThought(): void {
    this.getThougths();
  }

  clearThoughts(): void {
    localStorage.setItem('thoughts', undefined);
    this.getThougths();
  }

  private getThougths(): void {
    const localThoughts = localStorage.getItem('thoughts');
    try {
      this.thoughts = JSON.parse(localThoughts);
      if (!this.thoughts) {
        this.thoughts = [];
      }
    } catch (e) {
      console.log('caught error', e);
      this.thoughts = [];
    }
  }
}
