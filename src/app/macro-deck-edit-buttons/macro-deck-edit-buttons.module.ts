import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroDeckEditButtonsComponent } from './macro-deck-edit-buttons.component';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MacroDeckEditButtonsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [MacroDeckEditButtonsComponent]
})
export class MacroDeckEditButtonsModule { }
