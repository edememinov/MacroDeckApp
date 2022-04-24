import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroDeckEditButtonsComponent } from './macro-deck-edit-buttons.component';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmPopUpModule } from '../shared/confirm-pop-up/confirm-pop-up.module';
import { SatPopoverModule } from '@ncstate/sat-popover';



@NgModule({
  declarations: [
    MacroDeckEditButtonsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SatPopoverModule,
    ConfirmPopUpModule
  ],
  exports: [MacroDeckEditButtonsComponent]
})
export class MacroDeckEditButtonsModule { }
