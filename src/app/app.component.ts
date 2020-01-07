import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  thoughts: object[] = [];

  ngOnInit() {
    this.getThougths();
  }

  newThought(): void {
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
      console.error(e);
      this.thoughts = [];
    }
  }
}
