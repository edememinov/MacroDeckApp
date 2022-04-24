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
import { SatPopoverModule } from '@ncstate/sat-popover';
import { MacroDeckEditButtonsModule } from '../macro-deck-edit-buttons/macro-deck-edit-buttons.module';
import { ConfirmPopUpModule } from '../shared/confirm-pop-up/confirm-pop-up.module';




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
    SearchBoxModule,
    SatPopoverModule,
    MacroDeckEditButtonsModule,
    ConfirmPopUpModule
  ]
})
export class MacroDeckButtonsModule { }
