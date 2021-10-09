import { TestBed } from '@angular/core/testing';

import { MacrodeckButtonOptionsService } from './macrodeck-button-options.service';

describe('MacrodeckButtonOptionsService', () => {
  let service: MacrodeckButtonOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacrodeckButtonOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
