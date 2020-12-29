/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CampoService } from './campo.service';

describe('Service: Campo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampoService]
    });
  });

  it('should ...', inject([CampoService], (service: CampoService) => {
    expect(service).toBeTruthy();
  }));
});
