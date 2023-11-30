import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { DatePipe } from '@angular/common';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
  textoIngresado2: string ="";
  turnosFiltrados: any[] = [];
  turnos : any;
  arrayPacientes: any;
  resenia: string = "";
  seEligioHistorial: boolean = false;
  turnoElegido: any;
  historial: any[] =[];
  usuarios: any;

  constructor(private notificaciones: NotificacionesService, private firebase: FirebaseService, private datePipe: DatePipe, )
  {

  }

  async ngOnInit() 
  {
    this.obser2$ = await this.firebase.TraerUsuarios().subscribe(async datos => {
      this.usuarios = datos.map(usuario => {
        const { uId, nombre, correo, tipoRegistro }: any = usuario;
        return { uId, nombre, correo, tipoRegistro };
      });
    });

    this.obser2$ = await this.firebase.TrearTurnos().subscribe(async datos => {
      this.turnos = datos
      this.turnosFiltrados = this.turnos;
      console.log(this.turnosFiltrados);
    });

  }

  ExcelFileTurno(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
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

    if(this.textoIngresado == "" )
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
          turno.doctor.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda)   ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.doctor.mail.toLocaleLowerCase().includes(busqueda) ||
          turno.horario.toLocaleLowerCase().includes(busqueda)   ||
          turno.estadoTurno.toLocaleLowerCase().includes(busqueda)   ||
          turno.historialMedico.altura.includes(busqueda)   ||
          turno.historialMedico.peso.includes(busqueda)   ||
          turno.historialMedico.temperatura.includes(busqueda)   ||
          turno.historialMedico.presion.includes(busqueda)   ||
          turno.historialMedico.clave1.includes(busqueda)   ||
          turno.historialMedico.valor1.includes(busqueda)   ||
          turno.historialMedico.clave2.includes(busqueda)   ||
          turno.historialMedico.valor2.includes(busqueda)   ||
          turno.historialMedico.clave3.includes(busqueda)   ||
          turno.historialMedico.valor3.includes(busqueda)   ||
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

  MostrarHistorialMedico(turnoPaciente: any)
  {
    this.seEligioHistorial = true
    this.turnoElegido = turnoPaciente;
    console.log(this.turnoElegido.historialMedico.altura);
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
