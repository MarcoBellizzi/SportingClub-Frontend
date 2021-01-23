import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FasciaOraria } from '../domain/FasciaOraria';

@Injectable({
  providedIn: 'root'
})
export class FasciaOrariaService {

constructor(
  private httpClient: HttpClient
) { }

getFasceOrarie(): Observable<FasciaOraria[]> {
  return this.httpClient.get<FasciaOraria[]>(`${environment.API_URL}/sporting/fasceOrarie`);
}

getFasciaOraria(fasciaId: number) {
  return this.httpClient.get<FasciaOraria>(`${environment.API_URL}/sporting/fasciaOraria?fasciaId=${fasciaId}`);
}

}
