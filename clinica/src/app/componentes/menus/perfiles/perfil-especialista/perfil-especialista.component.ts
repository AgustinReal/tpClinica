import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';

@Component({
  selector: 'app-perfil-especialista',
  templateUrl: './perfil-especialista.component.html',
  styleUrls: ['./perfil-especialista.component.css']
})
export class PerfilEspecialistaComponent {
  usuario: any;
  obser$ : any;
  especialidadAux: string = "";
  arrayDiasSeleccionados: any[] =[
                        {dia: "Lunes",
                        trabaja: false},
                        {dia: "Martes",
                        trabaja: false},
                        {dia: "Miercoles",
                        trabaja: false},
                        {dia: "Jueves",
                        trabaja: false},
                        {dia: "Viernes",
                        trabaja: false}
                        ];

  atraparDias: string[] = [];
  minutos: number = 0;

  constructor(private firebase: FirebaseService, private toast: NotificacionesService)
  {

  }

  ngOnInit() 
  {
    this.obser$ = this.firebase.TraerEspecialistas().subscribe(async datos => {
      this.usuario = await datos.filter((response: any) => {return response.mail == this.firebase.correoLogueado});
    });
  }

  ngOnDestroy() {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }
  }

  SeleccionarDia(dia: any)
  {
    dia.trabaja = !dia.trabaja;
  }

  AtraparEspecialidad(especialidad: string)
  {
    this.especialidadAux = especialidad.toLocaleUpperCase();
  }

  AltaTurno()
  {
    if(this.especialidadAux != "")
    {
      for (let i = 0; i < this.arrayDiasSeleccionados.length; i++) 
      {
        if(this.arrayDiasSeleccionados[i].trabaja == true)
        {
          this.atraparDias.push(this.arrayDiasSeleccionados[i]);
        }  
      }
      if(this.atraparDias.length > 0)
      {
        let horarios = {
          especialidad: this.especialidadAux,
          dias: this.atraparDias,
          minutos: this.minutos
        };

        if(horarios.minutos > 0)
        {
          this.firebase.ModificarUsuario("especialista", this.usuario[0], "horarios", horarios);
          this.toast.NotificarConToast('Horarios habilitado', "toast-success");
        }
        else
        {
          this.toast.NotificarConToast('Ingrese la carga horaria', "toast-warning");
        }
      }
      else
      {
        this.toast.NotificarConToast('Elija los dias de trabajo', "toast-warning");
      }
    }
    else
    {
      this.toast.NotificarConToast('Elija una especialidad', "toast-warning");;
    }
  }
}
