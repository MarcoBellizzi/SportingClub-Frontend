/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FasciaOrariaService } from './fasciaOraria.service';

describe('Service: FasciaOraria', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FasciaOrariaService]
    });
  });

  it('should ...', inject([FasciaOrariaService], (service: FasciaOrariaService) => {
    expect(service).toBeTruthy();
  }));
});
