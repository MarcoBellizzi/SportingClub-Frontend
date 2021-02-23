import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Prenotazione } from '../domain/Prenotazione';
import { PrenotazioneFissa } from '../domain/PrenotazioneFissa';

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

  annullaPrenotazione(prenotazioneId: number) {
    return this.httpClient.delete(`${environment.API_URL}/sporting/prenotazione/annulla?prenotazioneId=${prenotazioneId}`);
  }
  
  getPrenotazioniAfter(atletaId: number, giorno: Date) {
    return this.httpClient.put<Prenotazione[]>(`${environment.API_URL}/sporting/prenotazioni/after?atletaId=${atletaId}`, giorno);
  }

  getPrenotazioniFissa() {
    return this.httpClient.get<PrenotazioneFissa[]>(`${environment.API_URL}/sporting/prenotazioniFisse`);
  }

  addPrenotazioneFissa(prenotazioneFissa: PrenotazioneFissa) {
    return this.httpClient.post<PrenotazioneFissa>(`${environment.API_URL}/sporting/addPrenotazioneFissa`, prenotazioneFissa);
  }

  eliminaPrenotazioneFissa(id: number) {
    return this.httpClient.delete(`${environment.API_URL}/sporting/eliminaPrenotazioneFissa?id=${id}`);
  }

} 
