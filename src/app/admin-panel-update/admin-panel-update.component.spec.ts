import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelUpdateComponent } from './admin-panel-update.component';

describe('AdminPanelFilesComponent', () => {
  let component: AdminPanelUpdateComponent;
  let fixture: ComponentFixture<AdminPanelUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPanelUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
