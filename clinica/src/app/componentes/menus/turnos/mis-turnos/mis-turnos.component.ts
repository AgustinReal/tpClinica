import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';


@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent {
  usuario?: any;
  obser$ : any;
  obser2$ : any;
  textoIngresado: string ="";
  turnosFiltrados: any[] = [];
  turnos : any;
  valorCalificacion: string="";

  constructor(private notificaciones: NotificacionesService,private firebase: FirebaseService, private datePipe: DatePipe )
  {

  }

  async ngOnInit() 
  {
    this.obser$ = await this.firebase.TraerPacientes().subscribe(async datos => {
      this.usuario = await datos.filter((response: any) => {return response.mail == this.firebase.correoLogueado});

    });

    this.obser2$ = await this.firebase.TrearTurnos().subscribe(async datos => {
      this.turnos = await datos.filter((response: any) => {return response.paciente.mail == this.firebase.correoLogueado});
      this.turnosFiltrados = this.turnos;
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
        console.log('Comentario ingresado:', comentario);

        await this.firebase.ModificarTurno("turnos", pacienteAux, "estadoTurno", "cancelado");
        await this.firebase.ModificarTurno("turnos", pacienteAux, "comentario", comentario);

        this.notificaciones.NotificarConToast("No se acepto el turno.", "toast-success");
    
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Acción cancelada', 'info');
      }
    });

  }

  async MostrarResenia(pacienteTurno: any)
  {
    Swal.fire({
      title: `Reseñia del doctor ${pacienteTurno.doctor.apellido} ${pacienteTurno.doctor.nombre}`,
      text: `${pacienteTurno.resenia}`,
      iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',      
    });
  }

  MostrarHistorialMedico(turnoPaciente: any)
  {

    Swal.fire({
      title: 'HISTORIA MEDICA',
      iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',      
      confirmButtonText: 'ok',
      background: "rgb(95, 186, 228)",
      width: "1400px",
      cancelButtonText: 'Cancelar',
      html: `
      <table class="table table-success table-striped w-100" style="border-radius: 30px;">
      <thead>
          <tr>
            <th scope="col">ALTURA</th>
            <th scope="col">DIAGNOSTICO</th>
            <th scope="col">EDAD</th>
            <th scope="col">PESO</th>
            <th scope="col">PRESION</th>
            <th scope="col">SEXO</th>
            <th scope="col">CLAVE 1 - VALOR 1</th>
            <th scope="col">CLAVE 2 - VALOR 2</th>
            <th scope="col">CLAVE 3 - VALOR 3</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let filtrar of this.turnosFiltrados; index as i">
            <td>${turnoPaciente.historialMedico.altura}</td>
            <td>${turnoPaciente.historialMedico.diagnostico}</td>
            <td>${turnoPaciente.historialMedico.edad}</td>
            <td>${turnoPaciente.historialMedico.peso}</td>
            <td>${turnoPaciente.historialMedico.presion}</td>
            <td>${turnoPaciente.historialMedico.sexo}</td>
            <td>${turnoPaciente.historialMedico.clave1} : ${turnoPaciente.historialMedico.valor1}</td>
            <td>${turnoPaciente.historialMedico.clave2} : ${turnoPaciente.historialMedico.valor2}</td>
            <td>${turnoPaciente.historialMedico.clave3} : ${turnoPaciente.historialMedico.valor3}</td>
            </tr> 
        </tbody>
  </table>
            `,
      inputPlaceholder: 'Ingrese un comentario', // Placeholder del campo de entrada
      customClass: {
        confirmButton: 'btn-confirm', // Clase CSS personalizada para el botón de confirmar
        cancelButton: 'btn-default',
        container: 'swal-custom-container',
      },
      iconColor: '#ff0000', // Color del icono
      confirmButtonColor: '#008000', 
      cancelButtonColor: '#ff0000'
        }).then(async (result) => {
          if (result.isConfirmed) 
          {
            


          }
        });
  }

  HacerEncuesta(doctor: any)
  {
    Swal.fire({
      title: 'Encuesta',
      iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',      
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      width: "1000px",
      
      html: `
              <label>¿Que le parecio el trato del doctor?</label>
              <input type="text" id="doctor" class="swal2-input" style="width: 500px;" placeholder="">
              <br>
              <label>¿Recomendarias nuestros servicios?</label>
              <input type="text" id="recomendarias" style="width: 500px;" class="swal2-input" placeholder="">
            `,
      customClass: {
        confirmButton: 'btn-confirm', // Clase CSS personalizada para el botón de confirmar
        cancelButton: 'btn-default',
        popup: '.swal2-popup',
      },
      iconColor: '#ff0000', // Color del icono
      confirmButtonColor: '#008000', 
      cancelButtonColor: '#ff0000'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const doctorer = (document.getElementById('doctor') as HTMLInputElement).value;
            const recomendarias = (document.getElementById('recomendarias') as HTMLInputElement).value;


            let encuesta = {
              doctor: doctorer,
              recomendarias: recomendarias,
            }


            await this.firebase.ModificarTurno("turnos", doctor, "reseniaDelUsuario", encuesta);
            this.notificaciones.NotificarConToast("Paciente cargo la reseña.", "toast-success");

            Swal.fire('¡Confirmado!', 'Datos cargados');

          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('Cancelado', 'Acción cancelada', 'info');
          }});
  }



CalificarAtencipn(doctor: any) 
{
  Swal.fire({
    title: 'Encuesta',
    iconHtml: '<img src="../../../../favicon.ico" style="width: 50px; height: 50px;" alt="">',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    width: "1000px",
    html: `
    <input type="number" id="valorCalificacion" class="swal2-input" placeholder="Ingrese la calificación del 1 al 5">
    `,
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
      
      const consulta = (document.getElementById('valorCalificacion') as HTMLInputElement).value;

      // Realiza otras acciones necesarias aquí
      await this.firebase.ModificarTurno("turnos", doctor, "calificaciónUsuario", consulta);
      this.notificaciones.NotificarConToast("Se cargo la calificación.", "toast-success");
      Swal.fire('¡Confirmado!', 'Datos cargados');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelado', 'Acción cancelada', 'info');
    }
  });
}
  

  IndicarCalificacion(calificacion: string)
  {
    switch (calificacion) {
      case "1":
        this.valorCalificacion = "1";
        break;
        case "2":
          this.valorCalificacion = "2";

        break;
        case "3":
          this.valorCalificacion = "3";

        break;
        case "4":
          this.valorCalificacion = "4";

        break;
        case "5":
          this.valorCalificacion = "5";

        break;
    }
    console.log(this.valorCalificacion);
  }
  


  obtenerFechaFormateada( fecha: any): any {
    const fechaJs = new Date(fecha.seconds * 1000);

    return this.datePipe.transform(fechaJs, 'dd/MM/yyyy');
  }

  FiltrarEspecialidad(especialidad: string)
  {
    this.textoIngresado = especialidad;
  }

  FiltrarEspecialista(especialista: string)
  {
    this.textoIngresado = especialista;
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
        
        if(turno.especialista.toLocaleLowerCase().includes(busqueda)   || 
          turno.doctor.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.doctor.nombre.toLocaleLowerCase().includes(busqueda)   ||
          turno.doctor.mail.toLocaleLowerCase().includes(busqueda) ||
          turno.horario.toLocaleLowerCase().includes(busqueda)   ||
          fechaABuscar.includes(busqueda))
        {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }
}
