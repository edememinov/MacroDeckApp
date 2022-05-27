import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroDeckCustomButtonsComponent } from './macro-deck-custom-buttons.component';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorWrapperModule } from '../electron-monaco-wrapper/monaco-editor-wrapper.module'

import { EditorPreferencesService } from '../services/editor-preferences.service';
import { MonacoEditorModule, MONACO_PATH } from '@materia-ui/ngx-monaco-editor';


@NgModule({
  declarations: [MacroDeckCustomButtonsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorWrapperModule
  ],
  providers:[EditorPreferencesService]
})
export class MacroDeckCustomButtonsModule { }
