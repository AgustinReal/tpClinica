import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { DatePipe } from '@angular/common';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos-administrador',
  templateUrl: './turnos-administrador.component.html',
  styleUrls: ['./turnos-administrador.component.css']
})
export class TurnosAdministradorComponent {

  usuario?: any;
  obser$ : any;
  obser2$ : any;
  obser3$ : any;
  textoIngresado: string ="";
  turnosFiltrados: any[] = [];
  turnos : any;
  arrayPacientes: any;
  resenia: string = "";

  constructor(private notificaciones: NotificacionesService, private firebase: FirebaseService, private datePipe: DatePipe, )
  {

  }

  async ngOnInit() 
  {


    this.obser2$ = await this.firebase.TrearTurnos().subscribe(async datos => {
      this.turnos = datos
      this.turnosFiltrados = this.turnos;
      console.log(this.turnosFiltrados);
    });

  }

  ngOnDestroy() {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }

    if (this.obser2$) 
    {
      this.obser2$.unsubscribe();
    }

    if (this.obser3$) 
    {
      this.obser3$.unsubscribe();
    }
  }

  obtenerFechaFormateada( fecha: any): any {
    const fechaJs = new Date(fecha.seconds * 1000);

    return this.datePipe.transform(fechaJs, 'dd/MM/yyyy');
  }


  FiltrarBusqueda()
  {
    this.turnosFiltrados = [];

    if(this.textoIngresado == "")
    {
      this.turnosFiltrados = [...this.turnos];
    }
    else
    {
      const busqueda = this.textoIngresado.trim().toLocaleLowerCase();

      for (let i = 0; i < this.turnos.length; i++) 
      {
        const turno = this.turnos[i];
        const fechaABuscar = this.obtenerFechaFormateada(turno.dia);

        console.log(turno);
        console.log(busqueda)
        
        if(turno.especialista.toLocaleLowerCase().includes(busqueda)   || 
          turno.doctor.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.doctor.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda)   ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.doctor.mail.toLocaleLowerCase().includes(busqueda) ||
          turno.horario.toLocaleLowerCase().includes(busqueda)   ||
          turno.estadoTurno.toLocaleLowerCase().includes(busqueda)   ||
          fechaABuscar.includes(busqueda))
        {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }

  async AceptarTurno(pacienteAux: any)
  {

    await this.firebase.ModificarTurno("turnos", pacienteAux, "estadoTurno", "aceptado");
  
    this.notificaciones.NotificarConToast("Se acepto el turno.", "toast-success");


  }

  async CancelarTurno(pacienteAux: any)
  {
    Swal.fire({
      title: 'Cancelar Turno',
      text: 'Agregar comentario del motivo',
      iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',      
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      input: 'text', // Tipo de entrada (puede ser 'text', 'password', 'email', etc.)
      inputPlaceholder: 'Ingrese un comentario', // Placeholder del campo de entrada
      customClass: {
        confirmButton: 'btn-confirm', // Clase CSS personalizada para el botón de confirmar
        cancelButton: 'btn-default',
        popup: '.swal2-popup',
      },
      iconColor: '#ff0000', // Color del icono
      confirmButtonColor: '#008000', 
      cancelButtonColor: '#ff0000', 
    }).then(async (result) => {
      if (result.isConfirmed) {
        const comentario = result.value; // Obtener el valor ingresado
    
        Swal.fire('¡Confirmado!', 'Acción confirmada', 'success');
    
        // Puedes hacer algo con el comentario, por ejemplo, enviarlo al servidor


        await this.firebase.ModificarTurno("turnos", pacienteAux, "estadoTurno", "rechazado");
        await this.firebase.ModificarTurno("turnos", pacienteAux, "comentario", comentario);

        this.notificaciones.NotificarConToast("No se acepto el turno.", "toast-success");
    
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Acción cancelada', 'info');
      }
    });

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
