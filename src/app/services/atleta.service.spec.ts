/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AtletaService } from './atleta.service';

describe('Service: Atleta', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AtletaService]
    });
  });

  it('should ...', inject([AtletaService], (service: AtletaService) => {
    expect(service).toBeTruthy();
  }));
});
