import { TestBed } from '@angular/core/testing';

import { ActiveScreenshot } from './active-screenshot';

describe('ActiveScreenshot', () => {
  let service: ActiveScreenshot;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveScreenshot);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
