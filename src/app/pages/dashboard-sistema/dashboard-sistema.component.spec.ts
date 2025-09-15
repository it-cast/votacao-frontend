import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSistemaComponent } from './dashboard-sistema.component';

describe('DashboardSistemaComponent', () => {
  let component: DashboardSistemaComponent;
  let fixture: ComponentFixture<DashboardSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSistemaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
