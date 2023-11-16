import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilEspecialistaComponent } from './perfil-especialista.component';

describe('PerfilEspecialistaComponent', () => {
  let component: PerfilEspecialistaComponent;
  let fixture: ComponentFixture<PerfilEspecialistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilEspecialistaComponent]
    });
    fixture = TestBed.createComponent(PerfilEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
