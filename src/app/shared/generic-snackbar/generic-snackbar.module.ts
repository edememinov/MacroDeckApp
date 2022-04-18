import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericSnackbarComponent } from './generic-snackbar.component';
import { MaterialModule } from '../../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    GenericSnackbarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GenericSnackbarModule { }
