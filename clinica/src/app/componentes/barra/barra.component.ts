import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.css']
})
export class BarraComponent {

  esEspecialista: boolean = false;
  usuario: any;
  obser$: any;

  

  constructor(public firebase: FirebaseService)
  {

  }

  async ngOnInit() 
  {
    this.obser$ = await this.firebase.TraerEspecialistas().subscribe(async datos => {
      this.usuario = await datos.filter((response: any) => {return response.mail == this.firebase.correoLogueado});

      console.log(this.usuario);
      if(this.usuario[0].loginHabilitado == true )
      {
        this.esEspecialista = true;
      }
      else
      {
        this.esEspecialista = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.obser$) 
    {
      this.esEspecialista = false;
      this.obser$.unsubscribe();
    }
  }

  CerrarSesion()
  {
    this.esEspecialista = false;
    this.firebase.CerrarSesion();
  }
}
