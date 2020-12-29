/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PrenotazioneService } from './prenotazione.service';

describe('Service: Prenotazione', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrenotazioneService]
    });
  });

  it('should ...', inject([PrenotazioneService], (service: PrenotazioneService) => {
    expect(service).toBeTruthy();
  }));
});
