import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-control-usuarios',
  templateUrl: './control-usuarios.component.html',
  styleUrls: ['./control-usuarios.component.css']
})
export class ControlUsuariosComponent {

  obser$ : any;
  obser2$ : any;
  arrayEspecilistas: any = [];
  arrayPacientes: any = [];
  listadoEspecialista: boolean = false;
  altaAdministrador: boolean = false;
  listadoPacientes: boolean = false;

  constructor(private firebase: FirebaseService)
  {

  }

  ngOnInit() {

    
  }

  ngOnDestroy() {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }
    if (this.obser2$) 
    {
      this.obser$.unsubscribe();
    }
  }

  PresionarLsitadoEspecialistas()
  {
    if (this.obser2$) 
    {
      this.obser$.unsubscribe();
    }
    
    this.obser$ = this.firebase.TraerEspecialistas().subscribe(datos=>{
      this.AgregarEspecialidades(datos);
    });
    this.listadoEspecialista = true;
    this.altaAdministrador = false;
    this.listadoPacientes = false;
  }

  PresionarAltaAdministrador()
  {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }
    if (this.obser2$) 
    {
      this.obser$.unsubscribe();
    }
    this.altaAdministrador = true;
    this.listadoEspecialista = false;
    this.listadoPacientes = false;
  }

  PresionarListadoPacientes()
  {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }
    this.obser$ = this.firebase.TraerPacientes().subscribe(datos=>{
      this.AgregarPacientes(datos);
    });
    this.altaAdministrador = false;
    this.listadoEspecialista = false;
    this.listadoPacientes = true;
  }

  Habilitar(obj: any)
  {
    this.firebase.ModificarUsuarioEspecialista(obj, "loginHabilitado", true);
  }

  Desabilitar(obj: any)
  {
    this.firebase.ModificarUsuarioEspecialista(obj, "loginHabilitado", false);
  }

  AgregarEspecialidades(arrayAux: Array<any>)
  {
    let arrayNuevo =[];

    for (let i = 0; i < arrayAux.length; i++) 
    {
      arrayNuevo.push(arrayAux[i]);
    }

    this.arrayEspecilistas=arrayNuevo;
  }

  AgregarPacientes(arrayAux: Array<any>)
  {
    let arrayNuevo =[];

    for (let i = 0; i < arrayAux.length; i++) 
    {
      arrayNuevo.push(arrayAux[i]);
    }

    this.arrayPacientes=arrayNuevo;
  }
}
