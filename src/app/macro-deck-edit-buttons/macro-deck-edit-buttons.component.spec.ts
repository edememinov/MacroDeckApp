import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroDeckEditButtonsComponent } from './macro-deck-edit-buttons.component';

describe('MacroDeckEditButtonsComponent', () => {
  let component: MacroDeckEditButtonsComponent;
  let fixture: ComponentFixture<MacroDeckEditButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroDeckEditButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroDeckEditButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
