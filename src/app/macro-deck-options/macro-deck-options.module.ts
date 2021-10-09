import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MacroDeckOptionsComponent } from './macro-deck-options.component';



@NgModule({
  declarations: [MacroDeckOptionsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MacroDeckOptionsModule { }
