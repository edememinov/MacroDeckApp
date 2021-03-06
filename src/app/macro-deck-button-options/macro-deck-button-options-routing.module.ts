import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MacroDeckButtonOptionsComponent } from './macro-deck-button-options.component';

const routes: Routes = [
  {
    path: 'macrodeckbuttonoptions',
    component: MacroDeckButtonOptionsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MacroDeckButtonOptionsRoutingModule {}
