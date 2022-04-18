import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './home/home.module';
import { DetailModule } from './detail/detail.module';

import { AppComponent } from './app.component';
import { MaterialModule } from './material/material/material.module';
import { StoreModule } from '@ngrx/store';
import { MacroDeckOptionsModule } from './macro-deck-options/macro-deck-options.module';
import { MacroDeckButtonOptionsComponent } from './macro-deck-button-options/macro-deck-button-options.component';
import { MacroDeckButtonsComponent } from './macro-deck-buttons/macro-deck-buttons.component';
import { MacroDeckUrlModule } from './macro-deck-url/macro-deck-url.module';
import { MacroDeckButtonsModule } from './macro-deck-buttons/macro-deck-buttons.module';
import { SearchBoxComponent } from './search-box/search-box.component';
import { MacroDeckButtonOptionsModule } from './macro-deck-button-options/macro-deck-button-options.module';
import { MacroDeckCustomButtonsModule } from './macro-deck-custom-buttons/macro-deck-custom-buttons.module';
import { AdminPanelModule } from './admin-panel/admin-panel.module'
import { SafePipe } from './services/safe.pipe';
import { AdminPanelUpdateModule } from './admin-panel-update/admin-panel-update.module';
import { MacroDeckEditButtonsModule } from './macro-deck-edit-buttons/macro-deck-edit-buttons.module';
import { GenericSnackbarModule } from './shared/generic-snackbar/generic-snackbar.module';
import { SnackbarService } from './services/snackbar.service';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [AppComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    DetailModule,
    MaterialModule,
    MacroDeckOptionsModule,
    AppRoutingModule,
    MacroDeckUrlModule,
    MacroDeckButtonsModule,
    MacroDeckCustomButtonsModule,
    MacroDeckButtonOptionsModule,
    AdminPanelModule,
    AdminPanelUpdateModule,
    MacroDeckEditButtonsModule,
    GenericSnackbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot({}, {})
  ],
  providers: [SnackbarService],
  bootstrap: [AppComponent]
})
export class AppModule {}
