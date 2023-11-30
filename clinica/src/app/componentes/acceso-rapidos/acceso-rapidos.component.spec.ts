import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesoRapidosComponent } from './acceso-rapidos.component';

describe('AccesoRapidosComponent', () => {
  let component: AccesoRapidosComponent;
  let fixture: ComponentFixture<AccesoRapidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccesoRapidosComponent]
    });
    fixture = TestBed.createComponent(AccesoRapidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
