import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
@Component({
  selector: 'app-tabla-especialidades',
  templateUrl: './tabla-especialidades.component.html',
  styleUrls: ['./tabla-especialidades.component.css']
})
export class TablaEspecialidadesComponent {
  @Output() SeleccionarEspecilidad: EventEmitter<any> = new EventEmitter<any>();


  obser$ : any;
  arrayEspecilidades: any = [];

  constructor(private firebase: FirebaseService)
  {

  }

  ngOnInit() {

    this.obser$ = this.firebase.TraerEspecialidades().subscribe(datos=>{
      this.AgregarEspecialidades(datos);
    });
  }

  ngOnDestroy() {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }
  }

  SeleccionarEspecialidadTabla(especialidadAux: any)
  {
    this.SeleccionarEspecilidad.emit(especialidadAux);
  }

  AgregarEspecialidades(arrayAux: Array<any>)
  {
    let arrayNuevo =[];

    for (let i = 0; i < arrayAux.length; i++) 
    {
      arrayNuevo.push(arrayAux[i]);
    }

    this.arrayEspecilidades=arrayNuevo;
  }
}
