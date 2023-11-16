import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPacientesComponent } from './menu-pacientes.component';

describe('MenuPacientesComponent', () => {
  let component: MenuPacientesComponent;
  let fixture: ComponentFixture<MenuPacientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuPacientesComponent]
    });
    fixture = TestBed.createComponent(MenuPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
