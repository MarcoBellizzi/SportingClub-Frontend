/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DebitoService } from './debito.service';

describe('Service: Debito', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebitoService]
    });
  });

  it('should ...', inject([DebitoService], (service: DebitoService) => {
    expect(service).toBeTruthy();
  }));
});
