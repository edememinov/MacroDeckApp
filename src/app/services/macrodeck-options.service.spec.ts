import { TestBed } from '@angular/core/testing';

import { MacrodeckOptionsService } from './macrodeck-options.service';

describe('MacrodeckOptionsService', () => {
  let service: MacrodeckOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacrodeckOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
