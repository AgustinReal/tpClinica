import { Component, } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-solicitar-turnos',
  templateUrl: './solicitar-turnos.component.html',
  styleUrls: ['./solicitar-turnos.component.css']
})
export class SolicitarTurnosComponent {

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
  obserEspecialidades$: any;
  especialidadesTotales: any;
  arrayMedicosConEspecialidadEspecifica: any;

  seEligioEspecialidadPrincipal: boolean = false;
  especilidadDoctor: any;

  constructor(private firebase: FirebaseService, private notificaciones: NotificacionesService, private datePipe: DatePipe )
  {

  }

  ngOnInit() {

    this.obserEspecialidades$ = this.firebase.TraerEspecialidades().subscribe(datos=>
    {
      this.especialidadesTotales = datos;
    });

    this.obser2$ = this.firebase.TraerPacientes().subscribe(async datos => {
      this.usuario = await datos.filter((response: any) => {return response.mail == this.firebase.correoLogueado});
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

  AtraparDoctor(doctor: any)
  {
    console.log(doctor);
    this.doctorSeleccionado = doctor;
    this.seEligioDoctor = true;
    this.seEligioHorario = false;
    this.seEligioDia = false;
    this.AtraparEspecialidad(this.especilidadDoctor );
  }

  AtraparEspecialidadAux(especialidadAux: any)
  {
    
    this.especilidadDoctor = especialidadAux;
    this.seEligioEspecialidadPrincipal = true;
    this.obser$ = this.firebase.TraerEspecialistas().subscribe(async datos => {
      this.arrayEspecilistas = datos.filter((response: any) =>
        response.especialidad.some((e: any) => e === especialidadAux.especialidad)
        );
        console.log(this.arrayEspecilistas);
        if(this.arrayEspecilistas.length == 0)
        {
          this.notificaciones.NotificarConToast("No tenemos especialistas con esa especialidad.", "toast-warning");
        }
        else
        {
          this.seEligioDoctor = false;
          this.seEligioHorario = false;
          this.seEligioEspecialidad = false;
          this.seEligioDia = false;
        }
    });
  }


  AtraparEspecialidad(especialidadAux: any)
  {
    console.log(especialidadAux);
    especialidadAux =especialidadAux.especialidad;
    especialidadAux = especialidadAux.toUpperCase();
    console.log(especialidadAux);

    this.espcecialidadSelecionada = especialidadAux;

    console.log(this.espcecialidadSelecionada);
    
    if( this.doctorSeleccionado.horarios.especialidad == especialidadAux)
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
        console.log()
        this.diasEncontrados = this.doctorSeleccionado.horarios.dias;
        this.arrayDias = this.obtenerProximosDias2(this.diasEncontrados[1].dia, this.diasEncontrados[0].dia, 2);
        this.seEligioEspecialidad = true;
      }
      else
      {
        this.diasEncontrados = this.doctorSeleccionado.horarios.dias;
        console.log(this.diasEncontrados);
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

      console.log(this.doctorSeleccionado.horarios.minutos);

      this.atraparHorarios = this.obtenerHorarios(dia, "8:00", this.doctorSeleccionado.horarios.minutos, 12)
      .filter(horario => !this.arrayTurnos.some((turno: any) => turno.horario === horario && this.obtenerFechaFormateada(turno.dia) === formatoDia  && turno.doctor.mail === this.doctorSeleccionado.mail));

      console.log(this.arrayTurnos);
      console.log(this.doctorSeleccionado.mail);

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

    const horaFormateada = hora % 12 === 0 ? '12' : (hora % 12).toString().padStart(2, '0');
    const amPm = hora < 12 ? 'AM' : 'PM';
    const minutoFormateado = minuto.toString().padStart(2, '0');

    horarios.push(`${horaFormateada}:${minutoFormateado} ${amPm}`);
    }

    return horarios;
  }

 async mostrarSweetAlert()
  {
    Swal.fire({
      title: 'Sacar Turno',
      iconHtml: '<img src="../../../../favicon.ico" style="width: 50px;  height: 50px;" alt="">',   
      text: 'una vez seleccionado el turno, lo vera reflejado mis turnos.',
      background: "rgb(95, 186, 228)",
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) 
      {

        let turnoParaTurnos = {
          doctor: this.doctorSeleccionado,
          especialista: this.espcecialidadSelecionada,
          dia:this.atraparDiaFinal ,
          horario: this.atraparHorarioFinal,
          paciente: this.usuario[0],
          estadoTurno: "solicitado"
        };

        console.log(turnoParaTurnos);

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
