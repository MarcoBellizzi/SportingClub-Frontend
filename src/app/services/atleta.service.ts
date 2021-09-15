import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Atleta } from '../domain/Atleta';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtletaService {
  constructor(
    private httpClient: HttpClient
  ) { }

  login(telefono:number|undefined, password: string): Observable<Atleta> {
    return this.httpClient.get<Atleta>(`${environment.API_URL}/sporting/login?telefono=${telefono}&password=${password}`);
  }

  save(atleta: Atleta): Observable<Atleta> {
    return this.httpClient.post<Atleta>(`${environment.API_URL}/sporting/atleta/save`, atleta);
  }

  getAtleta(nome: string, cognome:string): Observable<Atleta> {
    return this.httpClient.get<Atleta>(`${environment.API_URL}/sporting/atleta?nome=${nome}&cognome=${cognome}`);
  }

  getAtleti(): Observable<Atleta[]> {
    return this.httpClient.get<Atleta[]>(`${environment.API_URL}/sporting/atleti`);
  }

  getAdmin(): Observable<Atleta[]> {
    return this.httpClient.get<Atleta[]>(`${environment.API_URL}/sporting/atleti/admin`)
  }

  getNotAdmin(): Observable<Atleta[]> {
    return this.httpClient.get<Atleta[]>(`${environment.API_URL}/sporting/atleti/notAdmin`)
  }

  update(atletaDto: Atleta): Observable<Atleta> {
    return this.httpClient.put<Atleta>(`${environment.API_URL}/sporting/atleta/update`, atletaDto)
  }

}
