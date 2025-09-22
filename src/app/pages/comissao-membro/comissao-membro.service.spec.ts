import { TestBed } from '@angular/core/testing';

import { ComissaoMembroService } from './comissao-membro.service';

describe('ComissaoMembroService', () => {
  let service: ComissaoMembroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComissaoMembroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
