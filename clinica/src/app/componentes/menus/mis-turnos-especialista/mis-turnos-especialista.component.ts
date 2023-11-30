import { Component, } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { DatePipe } from '@angular/common';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-mis-turnos-especialista',
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrls: ['./mis-turnos-especialista.component.css']
})
export class MisTurnosEspecialistaComponent {
  usuario?: any;
  obser$ : any;
  obser2$ : any;
  obser3$ : any;
  textoIngresado: string ="";
  turnosFiltrados: any[] = [];
  turnos : any;
  arrayPacientes: any;
  resenia: string = "";


  constructor(private fb: FormBuilder, private notificaciones: NotificacionesService, private firebase: FirebaseService, private datePipe: DatePipe, )
  {

  }

  async ngOnInit() 
  {
    this.obser$ = await this.firebase.TraerEspecialistas().subscribe(async datos => {
      this.usuario = await datos.filter((response: any) => {return response.mail == this.firebase.correoLogueado});

    });

    this.obser2$ = await this.firebase.TrearTurnos().subscribe(async datos => {
      this.turnos = await datos.filter((response: any) => {return response.doctor.mail == this.firebase.correoLogueado});
      this.turnosFiltrados = this.turnos;
    });

    this.obser3$ = await this.firebase.TraerPacientes().subscribe(async datos => {
      this.AgregarPacientes(datos);
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
        
        if(turno.especialista.toLocaleLowerCase().includes(busqueda)   || 
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda)   ||
          turno.paciente.mail.toLocaleLowerCase().includes(busqueda) ||
          turno.horario.toLocaleLowerCase().includes(busqueda)   ||
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
        console.log('Comentario ingresado:', comentario);

        await this.firebase.ModificarTurno("turnos", pacienteAux, "estadoTurno", "no aceptado");
        await this.firebase.ModificarTurno("turnos", pacienteAux, "comentario", comentario);

        this.notificaciones.NotificarConToast("No se acepto el turno.", "toast-success");
    
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Acción cancelada', 'info');
      }
    });

  }

  async RechazarTurno(pacienteAux: any)
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

         await this.firebase.ModificarTurno("turnos", pacienteAux, "estadoTurno", "rechazado");
         await this.firebase.ModificarTurno("turnos", pacienteAux, "comentario", comentario);
         this.notificaciones.NotificarConToast("Se canceló el turno.", "toast-success");
    
        this.notificaciones.NotificarConToast("Se canceló el turno.", "toast-success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Acción cancelada', 'info');
      }
    });

  }


 async FinalizarTurno(pacienteAux: any)
  {
    Swal.fire({
      title: 'Agregar reseña',
      iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',      
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      background: "rgb(95, 186, 228)",
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
    }).then((result) => {
      if (result.isConfirmed) {

       this.resenia = result.value;

        Swal.fire({
          title: 'Agregar historial medico',
          text: 'Agregar la información del paciente',
          iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',      
          showCancelButton: true,
          background: "rgb(95, 186, 228)",
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          
          width: "1400px",
          html: `<div class="justify-content-center d-flex flex-column" style="max-height: 850px; overflow-y: auto;">
                   <input  type="number" id="altura" class="swal2-input" placeholder="Ingrese la altura del paciente">
                   <br>
                   <input  type="number" id="temperatura" class="swal2-input" placeholder="Ingrese la temperatura del paciente">
                   <br>
                   <input  type="number" id="peso" class="swal2-input" placeholder="Ingrese el peso del paciente">
                   <br>
                   <input  type="text" id="sexo" class="swal2-input" placeholder="Ingrese el sexo del paciente">
                   <br>
                   <input  type="number" id="presion" class="swal2-input" placeholder="Ingrese su presion">
                   <br>
                   <input  type="text" id="diagnostico" class="swal2-input" placeholder="Ingrese su diagnostico">
                    <br> 
                    <div style="background-color: #66f7d7; border-radius: 30px;">
                      <input style="width:550px" type="text" id="clave1" class="swal2-input" placeholder="clave 1">
                      <input style="width:550px" type="text" id="valor1" class="swal2-input" placeholder="valor 1">
                      <br>
                    
                      <input style="width:550px" type="text" id="clave2" class="swal2-input" placeholder="clave 2">
                      <input style="width:550px" type="text" id="valor2" class="swal2-input" placeholder="valor 2">
                      <br>

                      <input style="width:550px" type="text" id="clave3" class="swal2-input" placeholder="clave 3">
                      <input style="width:550px" type="text" id="valor3" class="swal2-input" placeholder="valor 3">
                      <br>
                      <br>  
                    </div>
                  </div>`,
          inputPlaceholder: 'Ingrese un comentario', // Placeholder del campo de entrada
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
                const altura = (document.getElementById('altura') as HTMLInputElement).value;
                const temperatura = (document.getElementById('temperatura') as HTMLInputElement).value;
                const peso = (document.getElementById('peso') as HTMLInputElement).value;
                const sexo = (document.getElementById('sexo') as HTMLInputElement).value;
                const presion = (document.getElementById('presion') as HTMLInputElement).value;
                const diagnostico = (document.getElementById('diagnostico') as HTMLInputElement).value;
                const clave1 = (document.getElementById('clave1') as HTMLInputElement).value;
                const valor1 = (document.getElementById('valor1') as HTMLInputElement).value;
                const clave2 = (document.getElementById('clave2') as HTMLInputElement).value;
                const valor2 = (document.getElementById('valor2') as HTMLInputElement).value;
                const clave3 = (document.getElementById('clave3') as HTMLInputElement).value;
                const valor3 = (document.getElementById('valor3') as HTMLInputElement).value;


                let historialMedico = {
                  altura: altura,
                  temperatura: temperatura,
                  peso: peso,
                  sexo: sexo,
                  presion: presion,
                  diagnostico: diagnostico,
                  clave1: clave1,
                  clave2: clave2,
                  clave3: clave3,
                  valor1: valor1,
                  valor2: valor2,
                  valor3: valor3,
                }

                console.log(historialMedico);

                if(altura.length == 0)
                {
                  this.notificaciones.NotificarConToast("Error.Ingrese la altura del paciente", "toast-danger");
                }
                else if(temperatura.length == 0)
                {
                  this.notificaciones.NotificarConToast("Error.Ingrese la temperatura del paciente", "toast-danger");
                }
                else if(peso.length == 0)
                {
                  this.notificaciones.NotificarConToast("Error.Ingrese la edad del paciente", "toast-danger");
                }
                else if(sexo.length == 0)
                {
                  this.notificaciones.NotificarConToast("Error.Ingrese el sexo del paciente", "toast-danger");
                }
                else if(presion.length == 0)
                {
                  this.notificaciones.NotificarConToast("Error.Ingrese la presion del paciente", "toast-danger");
                }
                else if(diagnostico.length == 0)
                {
                  this.notificaciones.NotificarConToast("Error.Ingrese el diagnostico del paciente", "toast-danger");
                }
                else
                {
                  await this.firebase.ModificarTurno("turnos", pacienteAux, "estadoTurno", "finalizado");
                  await this.firebase.ModificarTurno("turnos", pacienteAux, "resenia", this.resenia);
                  await this.firebase.ModificarTurno("turnos", pacienteAux, "historialMedico", historialMedico);
                  this.notificaciones.NotificarConToast("Paciente atendido con exitos.", "toast-success");
               
                  Swal.fire('¡Confirmado!', 'Datos cargados');
                }



              } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelado', 'Acción cancelada', 'info');
              }});

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Acción cancelada', 'info');
      }
    });
  }

  

  async MostrarEncuesta(pacienteTurno: any)
  {
    alert("hola");
    Swal.fire({
      title: `Encuesta del paciente ${pacienteTurno.paciente.apellido} ${pacienteTurno.paciente.nombre}`,
      text: `Doctor: ${pacienteTurno.reseniaDelUsuario.doctor} y la Recomendación: ${pacienteTurno.reseniaDelUsuario.recomendarias}`,
      iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',      
    });
  }

  async MostrarCalificacion(pacienteTurno: any)
  {
    Swal.fire({
      title: `Calificación del paciente ${pacienteTurno.paciente.apellido} ${pacienteTurno.paciente.nombre}`,
      text: `${pacienteTurno.calificaciónUsuario}`,
      iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',      
    });
  }

  async MostrarResenia(pacienteTurno: any)
  {
    Swal.fire({
      title: `Reseñia de ${pacienteTurno.paciente.apellido} ${pacienteTurno.paciente.nombre}`,
      text: `${pacienteTurno.resenia}`,
      iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',      
    });
  }

  MostrarHistorialMedico(turnoPaciente: any)
  {

    Swal.fire({
      title: 'Agregar historial medico',
      text: 'Agregar la información del paciente',
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
