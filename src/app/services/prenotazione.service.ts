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

  annullaPrenotazione(fasciaOraria: number, campo: number) {
    return this.httpClient.delete(`${environment.API_URL}/sporting/prenotazione/annulla?fasciaOrariaId=${fasciaOraria}&campoId=${campo}`);
  }
  

}
