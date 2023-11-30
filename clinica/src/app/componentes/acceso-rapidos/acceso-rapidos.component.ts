import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-acceso-rapidos',
  templateUrl: './acceso-rapidos.component.html',
  styleUrls: ['./acceso-rapidos.component.css']
})
export class AccesoRapidosComponent {

  obser$: any;
  arrayAccesoEspecialista: any;
  @Output() eventUsuario:EventEmitter<any> = new EventEmitter<any> ();

  constructor(private firebase: FirebaseService)
  {

  }

  ngOnInit() {

    this.obser$ = this.firebase.TrearAccesosRapidos().subscribe(datos=>
    {
      this.arrayAccesoEspecialista = datos;
      console.log(datos);
    });
  }

  ngOnDestroy()
  {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }
  }

  TocarUsuario(user: any)
  {
    this.eventUsuario.emit(user);
  }
}
