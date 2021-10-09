import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroDeckButtonsComponent } from './macro-deck-buttons.component';

describe('MacroDeckButtonsComponent', () => {
  let component: MacroDeckButtonsComponent;
  let fixture: ComponentFixture<MacroDeckButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroDeckButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroDeckButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
