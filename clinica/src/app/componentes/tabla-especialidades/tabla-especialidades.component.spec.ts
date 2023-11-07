import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEspecialidadesComponent } from './tabla-especialidades.component';

describe('TablaEspecialidadesComponent', () => {
  let component: TablaEspecialidadesComponent;
  let fixture: ComponentFixture<TablaEspecialidadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaEspecialidadesComponent]
    });
    fixture = TestBed.createComponent(TablaEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
