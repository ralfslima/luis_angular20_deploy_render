import { TestBed } from '@angular/core/testing';

import { ApiPessoas } from './api-pessoas';

describe('ApiPessoas', () => {
  let service: ApiPessoas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPessoas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
