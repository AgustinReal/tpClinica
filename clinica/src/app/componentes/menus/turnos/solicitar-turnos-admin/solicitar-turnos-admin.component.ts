import { Component, } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-solicitar-turnos-admin',
  templateUrl: './solicitar-turnos-admin.component.html',
  styleUrls: ['./solicitar-turnos-admin.component.css']
})
export class SolicitarTurnosAdminComponent {
  obser$ : any;
  obser2$ : any;
  obser3$ : any;
  doctorSeleccionado: any;
  espcecialidadSelecionada: any;
  diasEncontrados: any;
  arrayEspecilistas: any = [];
  seEligioDoctor: boolean = false;
  seEligioEspecialidad: boolean = false;
  seEligioDia: boolean = false;
  seEligioHorario: boolean = false;
  arrayDias: any[] = [];
  atraparHorarios: any; 
  atraparHorarioFinal: any;
  atraparDiaFinal: any;
  usuario: any;
  arrayTurnos: any;
  arrayUsuarios: any;
  seEligioUsuario: boolean = false; 

  constructor(private firebase: FirebaseService, private notificaciones: NotificacionesService, private datePipe: DatePipe )
  {

  }

  ngOnInit() {

    this.obser$ = this.firebase.TraerEspecialistas().subscribe(async datos=>{
      this.arrayEspecilistas = datos.filter((response: any) => {return response.horarios});

      this.AgregarEspecialidades(this.arrayEspecilistas);
    });

    this.obser2$ = this.firebase.TraerPacientes().subscribe(async datos => {
      this.AgregarPacientes(datos);
    });

    this.obser3$ =  this.firebase.TrearTurnos().subscribe(datos=>{
      this.AgregarTurnos(datos);
    });
      

  }

  ngOnDestroy() {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }

    if(this.obser2$)
    {
      this.obser2$.unsubscribe();
    }

    if(this.obser3$)
    {
      this.obser3$.unsubscribe();
    }
  }

  AtraparPaciente(usuario: any)
  {
    this.usuario = usuario;
    this.seEligioDoctor = false;
    this.seEligioUsuario = true;
  }

  AtraparDoctor(doctor: any)
  {
    this.doctorSeleccionado = doctor;
    this.seEligioDoctor = true;
    this.seEligioEspecialidad = false;
    this.seEligioHorario = false;
    this.seEligioDia = false;
  }

  AtraparEspecialidad(especialidad: any)
  {
    this.espcecialidadSelecionada = especialidad;
    especialidad = especialidad.toLocaleUpperCase();
    
    if( this.doctorSeleccionado.horarios.especialidad == especialidad)
    {
      if(this.doctorSeleccionado.horarios.dias.length > 4)
      {
        this.diasEncontrados = this.doctorSeleccionado.horarios.dias;
        this.arrayDias = this.obtenerProximosDias5(this.diasEncontrados[4].dia, this.diasEncontrados[3].dia, this.diasEncontrados[2].dia, this.diasEncontrados[1].dia, this.diasEncontrados[0].dia, 2);
        this.seEligioEspecialidad = true;
      }
      else if(this.doctorSeleccionado.horarios.dias.length > 3)
      {
        this.diasEncontrados = this.doctorSeleccionado.horarios.dias;
        this.arrayDias = this.obtenerProximosDias4(this.diasEncontrados[3].dia, this.diasEncontrados[2].dia, this.diasEncontrados[1].dia, this.diasEncontrados[0].dia, 2);
        this.seEligioEspecialidad = true;
      }
      else if(this.doctorSeleccionado.horarios.dias.length > 2)
      {
        this.diasEncontrados = this.doctorSeleccionado.horarios.dias;
        this.arrayDias = this.obtenerProximosDias3(this.diasEncontrados[2].dia, this.diasEncontrados[1].dia, this.diasEncontrados[0].dia, 2);
        this.seEligioEspecialidad = true;
      }
      else if(this.doctorSeleccionado.horarios.dias.length > 1)
      {
        this.diasEncontrados = this.doctorSeleccionado.horarios.dias;
        this.arrayDias = this.obtenerProximosDias2(this.diasEncontrados[1].dia, this.diasEncontrados[0].dia, 2);
        this.seEligioEspecialidad = true;
      }
      else
      {
        this.diasEncontrados = this.doctorSeleccionado.horarios.dias;
        this.arrayDias = this.obtenerProximosDias1(this.diasEncontrados[0].dia, 2);
        this.seEligioEspecialidad = true;
      }
    }
    else
    {
      this.seEligioEspecialidad = false;
      this.notificaciones.NotificarConToast("El especialista no tiene turnos asignados.", "toast-warning");
    }
  }

  obtenerFechaFormateada( fecha: any): any {
    const fechaJs = new Date(fecha.seconds * 1000);

    return this.datePipe.transform(fechaJs, 'dd/MM/yyyy');
  }

  AtraparDia(dia: any)
  {
    if(this.seEligioEspecialidad)
    {
      this.atraparDiaFinal = dia;

      let formatoDia = this.datePipe.transform(dia, 'dd/MM/yyyy');

      this.atraparHorarios = this.obtenerHorarios(dia, "8:00", this.doctorSeleccionado.horarios.minutos, 12)
      .filter(horario => !this.arrayTurnos.some((turno: any) => turno.horario === horario && this.obtenerFechaFormateada(turno.dia) === formatoDia  && turno.doctor.email === this.doctorSeleccionado.email));

      this.seEligioDia = true;
    }
    else
    {
      this.seEligioDia = false;
    }
  }

  AtraparHorario(horario: any)
  {
    if( this.seEligioDia)
    {
      this.seEligioHorario = true;
      this.atraparHorarioFinal = horario;
      this.mostrarSweetAlert();
    }
    else
    {
      this.seEligioHorario = false;
    }
  }

  obtenerProximosDias1(dia2: string, cantidad: number): Date[] 
  {
    const fechaActual = new Date();
    const proximosDias: Date[] = [];


    const dia2Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia2.toLowerCase());

    const diasParaSumar2 = (dia2Objetivo - fechaActual.getDay() + 7) % 7;

    for (let i = 0; i < cantidad; i++) {
      const fecha2 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar2 + i * 7);

      proximosDias.push(fecha2);
    }

    return proximosDias;
  }

  obtenerProximosDias2(dia1: string, dia2: string, cantidad: number): Date[] 
  {
    const fechaActual = new Date();
    const proximosDias: Date[] = [];

    const dia1Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia1.toLowerCase());

    const dia2Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia2.toLowerCase());

    const diasParaSumar1 = (dia1Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar2 = (dia2Objetivo - fechaActual.getDay() + 7) % 7;

    for (let i = 0; i < cantidad; i++) {
      const fecha1 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar1 + i * 7);
      const fecha2 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar2 + i * 7);


      proximosDias.push(fecha1, fecha2);
    }

    return proximosDias;
  }

  obtenerProximosDias3(dia1: string, dia2: string, dia3: string, cantidad: number): Date[] 
  {
    const fechaActual = new Date();
    const proximosDias: Date[] = [];

    const dia1Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia1.toLowerCase());

    const dia2Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia2.toLowerCase());

    const dia3Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia3.toLowerCase());

    const diasParaSumar1 = (dia1Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar2 = (dia2Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar3 = (dia3Objetivo - fechaActual.getDay() + 7) % 7;

    for (let i = 0; i < cantidad; i++) {
      const fecha1 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar1 + i * 7);
      const fecha2 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar2 + i * 7);
      const fecha3 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar3 + i * 7);

      proximosDias.push(fecha1, fecha2, fecha3);
    }

    return proximosDias;
  }

  obtenerProximosDias4(dia1: string, dia2: string, dia3: string, dia4: string, cantidad: number): Date[] 
  {
    const fechaActual = new Date();
    const proximosDias: Date[] = [];

    const dia1Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia1.toLowerCase());

    const dia2Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia2.toLowerCase());

    const dia3Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia3.toLowerCase());

    const dia4Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia4.toLowerCase());

    const diasParaSumar1 = (dia1Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar2 = (dia2Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar3 = (dia3Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar4 = (dia4Objetivo - fechaActual.getDay() + 7) % 7;

    for (let i = 0; i < cantidad; i++) {
      const fecha1 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar1 + i * 7);
      const fecha2 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar2 + i * 7);
      const fecha3 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar3 + i * 7);
      const fecha4 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar4 + i * 7);

      proximosDias.push(fecha1, fecha2, fecha3, fecha4);
    }

    return proximosDias;
  }

  obtenerProximosDias5(dia1: string, dia2: string, dia3: string, dia4: string, dia5: string, cantidad: number): Date[] 
  {
    const fechaActual = new Date();
    const proximosDias: Date[] = [];

    const dia1Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia1.toLowerCase());

    const dia2Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia2.toLowerCase());

    const dia3Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia3.toLowerCase());

    const dia4Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia4.toLowerCase());

    const dia5Objetivo = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'].indexOf(dia5.toLowerCase());

    const diasParaSumar1 = (dia1Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar2 = (dia2Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar3 = (dia3Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar4 = (dia4Objetivo - fechaActual.getDay() + 7) % 7;
    const diasParaSumar5 = (dia5Objetivo - fechaActual.getDay() + 7) % 7;

    for (let i = 0; i < cantidad; i++) {
      const fecha1 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar1 + i * 7);
      const fecha2 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar2 + i * 7);
      const fecha3 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar3 + i * 7);
      const fecha4 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar4 + i * 7);
      const fecha5 = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diasParaSumar5 + i * 7);

      proximosDias.push(fecha1, fecha2, fecha3, fecha4, fecha5);
    }

    return proximosDias;
  }

  obtenerHorarios(fecha: Date, horaInicio: string, minutos: number, cantidad: number): string[] 
  {
    const horarios: string[] = [];

    const [hora, minuto] = horaInicio.split(':').map(Number);

    fecha.setHours(hora, minuto);

    for (let i = 0; i < cantidad; i++) {
      const nuevaFecha = new Date(fecha.getTime() + i * minutos * 60 * 1000);

      const hora = nuevaFecha.getHours();
      const minuto = nuevaFecha.getMinutes();

      const horaFormateada = hora.toString().padStart(2, '0');
      const minutoFormateado = minuto.toString().padStart(2, '0');

      horarios.push(`${horaFormateada}:${minutoFormateado}`);
    }

    return horarios;
  }

 async mostrarSweetAlert()
  {
    Swal.fire({
      title: 'Título del SweetAlert',
      text: 'Descripción del SweetAlert',
      icon: 'warning', // Puedes cambiar el icono a 'info', 'success', 'error', etc.
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) 
      {
        console.log(this.usuario);

        let turnoParaTurnos = {
          doctor: this.doctorSeleccionado,
          especialista: this.espcecialidadSelecionada,
          dia:this.atraparDiaFinal ,
          horario: this.atraparHorarioFinal,
          paciente: this.usuario,
          estadoTurno: "solicitado"
        };

        Swal.fire('¡Confirmado!', 'Acción confirmada', 'success');

        const turno = await this.firebase.ConsultarTurnoNoOcupado(turnoParaTurnos)

        console.log(turno);

        if(! turno)
        {
          await this.firebase.AgregarAColeccion(turnoParaTurnos, "turnos");
        }
        else
        {
          this.notificaciones.NotificarConToast("El especialista ya tiene ese turno ocupado.", "toast-warning");
        }
      } 
      else if (result.dismiss === Swal.DismissReason.cancel) 
      {
        Swal.fire('Cancelado', 'Acción cancelada', 'info');
      }
    });
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

    this.arrayUsuarios=arrayNuevo;
  }

  AgregarTurnos(arrayAux: Array<any>)
  {
    let arrayNuevo =[];

    for (let i = 0; i < arrayAux.length; i++) 
    {
      arrayNuevo.push(arrayAux[i]);
    }

    this.arrayTurnos=arrayNuevo;
  }


}
