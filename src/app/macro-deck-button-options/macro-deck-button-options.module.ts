import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroDeckButtonOptionsComponent } from './macro-deck-button-options.component';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MacroDeckButtonOptionsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MacroDeckButtonOptionsModule { }
