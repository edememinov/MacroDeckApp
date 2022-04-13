import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MacroDeckCustomButtonsComponent } from './macro-deck-custom-buttons.component';

const routes: Routes = [
  {
    path: 'macrodeckcustombuttons',
    component: MacroDeckCustomButtonsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MacroDeckCustomButtonsRoutingModule {}
