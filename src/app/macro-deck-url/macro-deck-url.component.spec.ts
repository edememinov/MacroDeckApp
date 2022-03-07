import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroDeckUrlComponent } from './macro-deck-url.component';

describe('MacroDeckUrlComponent', () => {
  let component: MacroDeckUrlComponent;
  let fixture: ComponentFixture<MacroDeckUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroDeckUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MacroDeckUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
