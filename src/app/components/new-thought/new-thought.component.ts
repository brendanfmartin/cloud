import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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

  constructor() { }

  ngOnInit() {}

  submit(): void {
    console.log('submitted')
    let thoughts: object[];
    try {
      thoughts = JSON.parse(localStorage.getItem('thoughts'));
      if (!thoughts) {
        thoughts = [];
      }
    } catch (e) {
      console.log('caught error', e);
      thoughts = [];
    }

    const newThought = {
      thought: this.thought,
      loc: {
        lat: randomLatLong(-180, 180, 3),
        long: randomLatLong(-180, 180, 3)
      }
    };
    thoughts.push(newThought);
    console.log(thoughts)
    console.log(JSON.stringify(thoughts))
    localStorage.setItem('thoughts', JSON.stringify(thoughts));

    this.newThought.emit();
    this.thought = null;
  }

}
