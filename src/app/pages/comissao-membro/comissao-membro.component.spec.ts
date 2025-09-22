import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComissaoMembroComponent } from './comissao-membro.component';

describe('ComissaoMembroComponent', () => {
  let component: ComissaoMembroComponent;
  let fixture: ComponentFixture<ComissaoMembroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComissaoMembroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComissaoMembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
