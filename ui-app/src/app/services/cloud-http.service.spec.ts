import { TestBed } from '@angular/core/testing';

import { CloudHttpService } from './cloud-http.service';

describe('CloudHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudHttpService = TestBed.get(CloudHttpService);
    expect(service).toBeTruthy();
  });
});
