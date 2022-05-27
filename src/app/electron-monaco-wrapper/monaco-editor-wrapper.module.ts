import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorWrapperComponent } from './monaco-editor-wrapper.component';
import { ElectronService } from '../core/services/electron/electron.service';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
  declarations: [MonacoEditorWrapperComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule
  ], 
  providers:[ElectronService],
  exports:[
    MonacoEditorWrapperComponent
  ]
})
export class MonacoEditorWrapperModule { }
