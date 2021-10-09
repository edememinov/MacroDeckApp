import { TestBed } from '@angular/core/testing';

import { MacrodeckButtonsService } from './macrodeck-buttons.service';

describe('MacrodeckButtonsService', () => {
  let service: MacrodeckButtonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacrodeckButtonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
