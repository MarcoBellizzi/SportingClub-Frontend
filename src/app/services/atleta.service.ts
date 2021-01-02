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

  login(username: string, password: string): Observable<Atleta> {
    let params = new HttpParams();
    params = params.set('username', username);
    params = params.set('password', password);
    return this.httpClient.get<Atleta>(`${environment.API_URL}/sporting/login`, {params});
  }

  save(atleta: Atleta): Observable<Atleta> {
    return this.httpClient.post<Atleta>(`${environment.API_URL}/sporting/atleta/save`, atleta);
  }

  getAtleta(username: string): Observable<Atleta> {
    return this.httpClient.get<Atleta>(`${environment.API_URL}/sporting/atleta?username=${username}`);
  }

  getAtleti(): Observable<Atleta[]> {
    return this.httpClient.get<Atleta[]>(`${environment.API_URL}/sporting/atleti`);
  }

}
