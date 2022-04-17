import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelUpdateComponent as AdminPanelUpdateComponent } from './admin-panel-update.component';

const routes: Routes = [
  {
    path: 'adminpanelupdate',
    component: AdminPanelUpdateComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelFilesRoutingModule {}
