import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MacroDeckButtonsComponent } from './macro-deck-buttons.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ListFilterPipe } from '../services/listFilter.pipe';
import { SearchBoxModule } from '../search-box/search-box.module';




@NgModule({
  declarations: [MacroDeckButtonsComponent, ListFilterPipe],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    DragDropModule,
    SearchBoxModule
  ]
})
export class MacroDeckButtonsModule { }
