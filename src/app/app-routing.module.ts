import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PrenotazioneComponent } from './prenotazione/prenotazione.component';
import { ProfiloComponent } from './profilo/profilo.component';
import { RegistrazioneComponent } from './registrazione/registrazione.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'home', component: HomeComponent},
  {path:'prenotazione', component: PrenotazioneComponent},
  {path:'registrazione', component: RegistrazioneComponent},
  {path:'profilo', component: ProfiloComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
