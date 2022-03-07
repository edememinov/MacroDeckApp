import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MacroDeckUrlComponent } from './macro-deck-url.component';

const routes: Routes = [
  {
    path: 'macrodeckurl',
    component: MacroDeckUrlComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MacroDeckUrlRoutingModule {}
