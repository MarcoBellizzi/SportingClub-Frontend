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

  login(email:string, password: string): Observable<Atleta> {
    return this.httpClient.get<Atleta>(`${environment.API_URL}/sporting/login?email=${email}&password=${password}`);
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

}
