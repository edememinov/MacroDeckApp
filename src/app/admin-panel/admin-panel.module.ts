import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPanelComponent } from './admin-panel.component';
import { SafePipe } from '../services/safe.pipe';



@NgModule({
  declarations: [
    AdminPanelComponent,
    SafePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[SafePipe]
})

export class AdminPanelModule { }
