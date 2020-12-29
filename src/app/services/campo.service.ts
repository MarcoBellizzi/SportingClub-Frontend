import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Campo } from '../domain/Campo';

@Injectable({
  providedIn: 'root'
})
export class CampoService {

constructor(
  private httpClient: HttpClient
) { }

getCampi(): Observable<Campo[]> {
  return this.httpClient.get<Campo[]>(`${environment.API_URL}/sporting/campi`);
}

}
