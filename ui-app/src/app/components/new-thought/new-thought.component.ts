import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Loc} from '../../models/thought';
import {LocationService} from '../../services/location.service';
import { ThoughtService } from '../../services/thought.service';

// https://stackoverflow.com/questions/6878761/javascript-how-to-create-random-longitude-and-latitudes
const randomLatLong = (from, to, fixed): string => {
  return (Math.random() * (to - from) + from).toFixed(fixed);
};

@Component({
  selector: 'app-new-thought',
  templateUrl: './new-thought.component.html',
  styleUrls: ['./new-thought.component.scss']
})
export class NewThoughtComponent implements OnInit {

  @Output() newThought: EventEmitter<void> = new EventEmitter<void>();

  thought: string;

  constructor(private locationService: LocationService,
              private thoughtService: ThoughtService) { }

  ngOnInit() {}

  submit(): void {
    let thoughts: object[];
    try {
      thoughts = JSON.parse(localStorage.getItem('thoughts'));
      if (!thoughts) {
        thoughts = [];
      }
    } catch (e) {
      thoughts = [];
    }

    const loc = localStorage.getItem('current_location');
    let currentLoc: Loc;

    if (loc) {
      currentLoc = JSON.parse(loc);
    } else {
      currentLoc = {
        lat: randomLatLong(-180, 180, 3),
        long: randomLatLong(-180, 180, 3),
        accuracy: 0
      };
    }

    const newThought = {
      thought: this.thought,
      loc: currentLoc
    };

    this.thoughtService.addThought(newThought).subscribe(
      (res) => {
        this.newThought.emit();
        this.thought = null;
      }
    );

  }

}
