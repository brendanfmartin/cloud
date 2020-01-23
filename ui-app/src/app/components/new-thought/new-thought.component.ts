import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocationService} from '../../services/location.service';
import {ThoughtService} from '../../services/thought.service';

// https://stackoverflow.com/questions/6878761/javascript-how-to-create-random-longitude-and-latitudes
@Component({
  selector: 'app-new-thought',
  templateUrl: './new-thought.component.html',
  styleUrls: ['./new-thought.component.scss'],
})
export class NewThoughtComponent implements OnInit {
  @Output() newThought: EventEmitter<void> = new EventEmitter<void>();

  thought: string;

  constructor(private locationService: LocationService,
              private thoughtService: ThoughtService) { }

  ngOnInit() {}

  async submit(): Promise<void> {
    const position = await this.locationService.getLocation();

    this.thoughtService.addThougghtDynamo(this.thought, position).subscribe(
      (res) => {
        console.log(res);
        this.newThought.emit();
        this.thought = null;
      });
  }
}
