import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MenubarModule } from 'primeng/menubar'
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PrenotazioneComponent } from './prenotazione/prenotazione.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';
import { MessageService } from 'primeng/api';
import { ProfiloComponent } from './profilo/profilo.component';
import { StrutturaComponent } from './struttura/struttura.component';


@NgModule({
  declarations: [											
    AppComponent,
      LoginComponent,
      HomeComponent,
      NavbarComponent,
      PrenotazioneComponent,
      RegistrazioneComponent,
      ProfiloComponent,
      StrutturaComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MenubarModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    CardModule,
    BrowserAnimationsModule,
    TableModule,
    CalendarModule,
    PanelModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
