import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroDeckOptionsComponent } from './macro-deck-options.component';

describe('MacroDeckOptionsComponent', () => {
  let component: MacroDeckOptionsComponent;
  let fixture: ComponentFixture<MacroDeckOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroDeckOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroDeckOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
