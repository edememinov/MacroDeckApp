import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MacroDeckButtonsComponent } from './macro-deck-buttons.component';

const routes: Routes = [
  {
    path: 'macrodeckbuttons',
    component: MacroDeckButtonsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MacroDeckButtonsRoutingModule {}
