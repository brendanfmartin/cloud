import { TestBed } from '@angular/core/testing';

import { ThoughtService } from './thought.service';

describe('ThoughtsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThoughtService = TestBed.get(ThoughtService);
    expect(service).toBeTruthy();
  });
});
