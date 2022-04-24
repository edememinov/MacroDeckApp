import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { DetailRoutingModule } from './detail/detail-routing.module';
import { MacroDeckOptionsRoutingModule } from './macro-deck-options/macro-deck-options-routing.module';
import { MacroDeckUrlRoutingModule } from './macro-deck-url/macro-deck-url-routing.module';
import { MacroDeckButtonsRoutingModule } from './macro-deck-buttons/macro-deck-buttons-routing.module';
import { MacroDeckButtonOptionsRoutingModule } from './macro-deck-button-options/macro-deck-button-options-routing.module';
import { MacroDeckCustomButtonsRoutingModule } from './macro-deck-custom-buttons/macro-deck-custom-buttons-routing.module';
import { AdminPanelRoutingModule } from './admin-panel/admin-panel-routing.module';
import { AdminPanelFilesRoutingModule } from './admin-panel-update/admin-panel-update-routing.module';

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
    RouterModule.forRoot(routes, { useHash: true }),
    HomeRoutingModule,
    DetailRoutingModule,
    MacroDeckOptionsRoutingModule,
    MacroDeckUrlRoutingModule,
    MacroDeckButtonsRoutingModule,
    MacroDeckButtonOptionsRoutingModule,
    MacroDeckCustomButtonsRoutingModule,
    AdminPanelRoutingModule,
    AdminPanelFilesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
