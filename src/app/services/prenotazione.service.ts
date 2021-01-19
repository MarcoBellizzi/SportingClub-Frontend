import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Prenotazione } from '../domain/Prenotazione';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {

  constructor(
    private httpClient: HttpClient
  ) { }

  save(prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.httpClient.post<Prenotazione>(`${environment.API_URL}/sporting/prenotazione/add`, prenotazione);
  }

  getPrenotazioni(giorno: Date): Observable<Prenotazione[]> {
    return this.httpClient.put<Prenotazione[]>(`${environment.API_URL}/sporting/prenotazioni/giorno`, giorno);
  }

  annullaPrenotazione(fasciaOraria: number, campo: number, giorno:Date) {
    return this.httpClient.put(`${environment.API_URL}/sporting/prenotazione/annulla?fasciaOrariaId=${fasciaOraria}&campoId=${campo}`, giorno);
  }
  
  getPrenotazioniAfter(atletaId: number, giorno: Date) {
    return this.httpClient.put<Prenotazione[]>(`${environment.API_URL}/sporting/prenotazioni/after?atletaId=${atletaId}`, giorno);
  }

  prenotazioneMultipla(prenotazione: Prenotazione, durata: number): Observable<Prenotazione[]> {
    return this.httpClient.post<Prenotazione[]>(`${environment.API_URL}/sporting/prenotazioni/multipla?durata=${durata}`, prenotazione);
  }

} 
