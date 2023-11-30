import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent 
{
  usuario: any;
  obser$ : any;
  obser2$: any;
  turno: any;

  constructor(private datePipe: DatePipe, private firebase: FirebaseService)
  {

  }

  ngOnInit() 
  {
    this.obser$ = this.firebase.TraerPacientes().subscribe(async datos => {
      this.usuario = await datos.filter((response: any) => {return response.mail == this.firebase.correoLogueado});
    });

    this.obser2$ = this.firebase.TrearTurnos().subscribe(async datos => {
      this.turno = await datos.filter((response: any) => {return response.paciente.mail == this.firebase.correoLogueado});
      console.log(this.turno);
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
  }

  crearPDF() {
    const DATA = document.getElementById('pdf');
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
        docResult.save("historial_clinico.pdf");
      });
  }

  obtenerFechaFormateada( fecha: any): any {
    const fechaJs = new Date(fecha.seconds * 1000);

    return this.datePipe.transform(fechaJs, 'dd/MM/yyyy');
  }
}
