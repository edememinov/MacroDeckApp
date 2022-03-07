import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { DetailRoutingModule } from './detail/detail-routing.module';
import { MacroDeckOptionsRoutingModule } from './macro-deck-options/macro-deck-options-routing.module';
import { MacroDeckUrlRoutingModule } from './macro-deck-url/macro-deck-url-routing.module';
import { MacroDeckButtonsRoutingModule } from './macro-deck-buttons/macro-deck-buttons-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    HomeRoutingModule,
    DetailRoutingModule,
    MacroDeckOptionsRoutingModule,
    MacroDeckUrlRoutingModule,
    MacroDeckButtonsRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
