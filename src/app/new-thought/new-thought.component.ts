import {Component, EventEmitter, OnInit, Output} from '@angular/core';

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
    let thoughts: object[];
    try {
      thoughts = JSON.parse(localStorage.getItem('thoughts'));
      if (!thoughts) {
        thoughts = [];
      }
    } catch (e) {
      console.error(e);
      thoughts = [];
    }

    const newThought = {thought: this.thought};
    thoughts.push(newThought);
    localStorage.setItem('thoughts', JSON.stringify(thoughts));

    this.newThought.emit();
    this.thought = null;
  }

}
