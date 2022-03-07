import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroDeckUrlComponent } from './macro-deck-url.component';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MacroDeckUrlComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MacroDeckUrlModule { }
