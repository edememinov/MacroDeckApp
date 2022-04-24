import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPopUpComponent } from './confirm-pop-up.component';
import { MaterialModule } from '../../material/material/material.module';



@NgModule({
  declarations: [
    ConfirmPopUpComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [ConfirmPopUpComponent]
})
export class ConfirmPopUpModule { }
