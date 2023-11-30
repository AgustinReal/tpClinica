import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as echarts from 'echarts';
import { FirebaseService } from 'src/app/servicios/firebase.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  obserLogs$: any;
  obserTurnos$: any;
  obserEspecialidades$: any
  arrayLogs: any;
  arrayTurnos: any;
  arrayEspecialidades: any;
  diasAtras: number = 0;


  constructor(private datePipe: DatePipe, private firebase: FirebaseService)
  {

  }

 ngOnInit(): void 
 {
   
   this.obserLogs$ = this.firebase.TrearLogs().subscribe(async datos => {
    this.arrayLogs = datos.map(usuario => {
      const { mail, fecha }: any = usuario;
      return { mail, fecha };
    });
    });
    
    this.obserTurnos$ = this.firebase.TrearTurnos().subscribe(async datos => {
      this.arrayTurnos =datos;
      this.GraficarCantidadDeTurnosPorDias();
      this.GraficarCantidadTurnosSolocitadoPorLapsoTiempo();
      this.GraficarCantidadTurnosTerminadoPorLapsoTiempo();
    });
    
    this.obserEspecialidades$ = this.firebase.TraerEspecialidades().subscribe(async datos => {
      this.GraficarCantidadTurnosPorEspecialidad(datos);
    });


 }

 ngOnDestroy() 
 {
  if (this.obserLogs$) 
  {
    this.obserLogs$.unsubscribe();
  }

  if (this.obserTurnos$) 
  {
    this.obserTurnos$.unsubscribe();
  }

  if (this.obserEspecialidades$) 
  {
    this.obserEspecialidades$.unsubscribe();
  }
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

crearPDF(nombreArchivo: string, idGrafico: string) {
  const DATA = document.getElementById(idGrafico);
  const doc = new jsPDF('p', 'pt', 'a4');
  const options = {
    background: 'white',
    scale: 2,
  };
  //@ts-ignore
  html2canvas(DATA, options)
    .then((canvas: any) => {
      const img = canvas.toDataURL('image/PNG');

      const bufferX = 30;
      const bufferY = 30;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(
        img,
        'PNG',
        bufferX,
        bufferY,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );
      return doc;
    })
    .then((docResult: any) => {
      docResult.save(nombreArchivo +".pdf");
    });
}


GraficarCantidadTurnosSolocitadoPorLapsoTiempo()
{
  var chartDom = document.getElementById('graficoCantidadTurnosSolicitadoPorLapsoTiempo');
  var myChart = echarts.init(chartDom);
  var option;
  let arrayCantidadTurnosMedicosLapsoDeTiempo : Array<any> = [];

  let arrayMedicos = this.obtenerMedicos();
  console.log(arrayMedicos[0]);

  let cantidadDias= this.contarTurnosEnLapsoTiempo(arrayMedicos[0], this.diasAtras, this.arrayTurnos, "aceptado");

 console.log(cantidadDias);

 for (const medico of arrayMedicos) 
  {
    arrayCantidadTurnosMedicosLapsoDeTiempo.push({value: this.contarTurnosEnLapsoTiempo(medico, this.diasAtras, this.arrayTurnos, "aceptado"), name: medico});
  }


  option = {
    title: {
      text: 'Cantidad de turnos solicitado por médico en un lapso de tiempo',
      subtext: 'Muestra los doctores mas activos',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: arrayCantidadTurnosMedicosLapsoDeTiempo,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  option && myChart.setOption(option);
}

GraficarCantidadTurnosTerminadoPorLapsoTiempo()
{
  var chartDom = document.getElementById('graficoCantidadTurnosTerminadoPorLapsoTiempo');
  var myChart = echarts.init(chartDom);
  var option;
  let arrayCantidadTurnosMedicosLapsoDeTiempo : Array<any> = [];

  let arrayMedicos = this.obtenerMedicos();
  console.log(arrayMedicos[0]);

  let cantidadDias= this.contarTurnosEnLapsoTiempo(arrayMedicos[0], this.diasAtras, this.arrayTurnos, "finalizado");

 console.log(cantidadDias);

 for (const medico of arrayMedicos) 
  {
    arrayCantidadTurnosMedicosLapsoDeTiempo.push({value: this.contarTurnosEnLapsoTiempo(medico, this.diasAtras, this.arrayTurnos, "finalizado"), name: medico});
  }


  option = {
    title: {
      text: 'Cantidad de turnos solicitado por médico en un lapso de tiempo',
      subtext: 'Muestra los doctores mas activos',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: arrayCantidadTurnosMedicosLapsoDeTiempo,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  option && myChart.setOption(option);
}

obtenerMedicos(): string[] {
  return Array.from(new Set(this.arrayTurnos.map((turno: any) => turno.doctor.nombre)));
}

calcularCantidadTurnos(doctor: any) 
{

    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaActual.getDate() - 7); // Retroceder 7 días

    const cantidadTurnos = this.arrayTurnos.filter((turno: any) =>
      turno.doctor.nombre === doctor && new Date(turno.dia) >= fechaLimite
    ).length;

    return cantidadTurnos;
}

contarTurnosEnLapsoTiempo(medico: string, cantidadDias: number, turnos: any, estadoTurno: string): number {
  const fechaActual = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaActual.getDate() - cantidadDias); // Retroceder la cantidad de días especificada

  return turnos.filter((turno: any) => turno.doctor.nombre  === medico && turno.estadoTurno === estadoTurno && turno.dia.toDate()  >= fechaLimite).length;
}

EligirCantidadDias(dia: number)
{
  this.diasAtras = dia;
}

GraficarCantidadTurnosPorEspecialidad(arrayEspecialidades: any)
{
  let chartDom = document.getElementById('graficoIdAux')!;
  let myChart = echarts.init(chartDom);
  let option: EChartsOption;
  let cantidad: number = 0;
  let arrayCantidadTurnosEspecialidad : Array<any> = [];

  for (const especialidad of arrayEspecialidades) 
  {
    for (const turno of this.arrayTurnos)
     {   
      if(especialidad.especialidad == turno.especialista)
      {
        cantidad++;
      }
    }
    arrayCantidadTurnosEspecialidad.push({value: cantidad, name: especialidad.especialidad})
  }


  option = {
    title: {
      text: 'Cantidad de turnos por especialidad',
      left: 'center'
    },
    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [50, 250],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: arrayCantidadTurnosEspecialidad,
      }
    ]
  };
  
  option && myChart.setOption(option);
}

GraficarCantidadDeTurnosPorDias()
{
  var chartDom = document.getElementById('graficoCantDiasTurnos');
  var myChart = echarts.init(chartDom);
  var option;

  this.contarDiasEspecificos(this.arrayTurnos, "Tuesday");

  let cantidadLunes = this.contarDiasEspecificos(this.arrayTurnos, "Monday");

  console.log(cantidadLunes);
  option = {
    title: {
      text: 'Cantidad de turnos por dia',
      left: 'center'
    },
    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        saveAsImage: { show: true }
      }
    },
    dataset: [
      {
        dimensions: ['DIAS', 'VALORES'],
        source: [
          ['LUNES', cantidadLunes],
          ['MARTES', this.contarDiasEspecificos(this.arrayTurnos, "Tuesday")],
          ['MIERCOLES', this.contarDiasEspecificos(this.arrayTurnos, "Wednesday")],
          ['JUEVES', this.contarDiasEspecificos(this.arrayTurnos, "Thursday")],
          ['VIERNES', this.contarDiasEspecificos(this.arrayTurnos, "Friday")],
          ['SABADO', this.contarDiasEspecificos(this.arrayTurnos, "Saturday")],
          ['DOMINGO', this.contarDiasEspecificos(this.arrayTurnos, "Sunday")],
        ]
      },
      {
        transform: {
          type: 'sort',
          config: { dimension: 'VALORES', order: 'desc' }
        }
      }
    ],
    xAxis: {
      type: 'category',
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: {},
    series: {
      type: 'bar',
      encode: { x: 'DIAS', y: 'VALORES' },
      datasetIndex: 1
    }
  };
  
  option && myChart.setOption(option);
}

contarDiasEspecificos(turnos: any[], diaEspecifico: string): number {
  // Filtrar los turnos que corresponden al día específico
  const turnosEnDiaEspecifico = turnos.filter(turno => {
    const fechaTurno = this.obtenerFechaFormateada(turno.dia); 
    return this.obtenerDiaDeLaSemana(fechaTurno) === diaEspecifico;
  });

  // Contar la cantidad de turnos en el día específico
  const cantidadTurnosEnDiaEspecifico = turnosEnDiaEspecifico.length;

  return cantidadTurnosEnDiaEspecifico;
}

// Función auxiliar para obtener el número del día de la semana a partir del nombre del día
 obtenerNumeroDia(nombreDia: string): number {
  console.log(nombreDia);
  const diasSemana = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return diasSemana.indexOf(nombreDia);
}

obtenerDiaDeLaSemana(fechaString: string): any {
  const fechaJs = this.obtenerFechaFormateada2(fechaString);
  return this.datePipe.transform(fechaJs, 'EEEE', 'es'); // 'EEEE' devuelve el nombre completo del día de la semana
}

private obtenerFechaFormateada2(fechaString: string): Date {
  const [dia, mes, anio] = fechaString.split('/');
  // Recordar que el mes en JavaScript es 0-indexed, así que restamos 1
  return new Date(+anio, +mes - 1, +dia);
}


  obtenerFechaFormateada( fecha: any): any {
    const fechaJs = new Date(fecha.seconds * 1000);

    return this.datePipe.transform(fechaJs, 'dd/MM/yyyy');
  }

  AgregarEspecialidades(arrayAux: Array<any>)
  {
    let arrayNuevo =[];

    for (let i = 0; i < arrayAux.length; i++) 
    {
      arrayNuevo.push(arrayAux[i]);
    }

    this.arrayEspecialidades=arrayNuevo;
  }



}
