import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MacroDeckOptionsComponent } from './macro-deck-options.component';

const routes: Routes = [
  {
    path: 'macrodecksettings',
    component: MacroDeckOptionsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MacroDeckOptionsRoutingModule {}
