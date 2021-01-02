import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Debito } from '../domain/Debito';

@Injectable({
  providedIn: 'root'
})
export class DebitoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllDebiti(): Observable<Debito[]>{
    return this.httpClient.get<Debito[]>(`${environment.API_URL}/sporting/debiti`);
  }

  getDebiti(atletaId: number): Observable<Debito[]> {
    return this.httpClient.get<Debito[]>(`${environment.API_URL}/sporting/debiti/atleta?atletaId=${atletaId}`);
  }

  addDebito(debito: Debito): Observable<Debito> {
    return this.httpClient.post<Debito>(`${environment.API_URL}/sporting/debito/add`, debito);
  }
}
