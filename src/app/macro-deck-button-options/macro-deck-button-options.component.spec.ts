import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroDeckButtonOptionsComponent } from './macro-deck-button-options.component';

describe('MacroDeckButtonOptionsComponent', () => {
  let component: MacroDeckButtonOptionsComponent;
  let fixture: ComponentFixture<MacroDeckButtonOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroDeckButtonOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroDeckButtonOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
