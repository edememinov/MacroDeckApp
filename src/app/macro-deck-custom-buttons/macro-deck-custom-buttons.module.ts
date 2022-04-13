import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroDeckCustomButtonsComponent } from './macro-deck-custom-buttons.component';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MacroDeckCustomButtonsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MacroDeckCustomButtonsModule { }
