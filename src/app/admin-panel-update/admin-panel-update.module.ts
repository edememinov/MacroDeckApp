import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelUpdateComponent as AdminPanelUpdateComponent } from './admin-panel-update.component';
import { SafePipe } from '../services/safe.pipe';
import { AdminPanelModule } from '../admin-panel/admin-panel.module';
import { MaterialModule } from '../material/material/material.module';



@NgModule({
  declarations: [
    AdminPanelUpdateComponent
  ],
  imports: [
    CommonModule,
    AdminPanelModule,
    MaterialModule
  ]
})
export class AdminPanelUpdateModule { }
