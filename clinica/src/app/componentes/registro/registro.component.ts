import { Component,  } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  titulo : string ="Seleccionar Paciente o Especialista";
  seleccionoDif: boolean =false;
  boolPaciente: boolean =false;
  boolEspecialista: boolean =false;
  foto1Url: string = '../../../assets/imagenes/registro/altaPaciente/clinicaIngreseFoto.png';
  file: any;
  formFotos: any;

  constructor(private formBuilder: FormBuilder, private router: Router,public firebase: FirebaseService, private notificacionesSweet: SweetalertService, private notificaciones: NotificacionesService, private storage: Storage) { }


  Seleccionar(num: number)
  {
    if(num == 1)
    {
      this.boolEspecialista = true;
      this.seleccionoDif= true;
      this.titulo = "Alta Paciente";
    }
    else if(num == 2)
    {
      this.boolPaciente = true;
      this.seleccionoDif= true;
      this.titulo = "Alta Especialista";

    }
  }

  get NombreTxt() {
    return this.formularioEncuesta.get("nombreTxt") as FormControl;
  }

  get ApellidoTxt() {
    return this.formularioEncuesta.get("apellidoTxt") as FormControl;
  }

  get EdadTxt() {
    return this.formularioEncuesta.get("edadTxt") as FormControl;
  }

  get DniTxt() {
    return this.formularioEncuesta.get("dniTxt") as FormControl;
  }

  get ObraSocialTxt() {
    return this.formularioEncuesta.get("obraSocialTxt") as FormControl;
  }

  get MailTxt() {
    return this.formularioEncuesta.get("mailTxt") as FormControl;
  }

  get ContraseniaTxt() {
    return this.formularioEncuesta.get("contraseniaTxt") as FormControl;
  }

  get ContraseniaConfirmacionTxt()
  {
    return this.formularioEncuesta.get('contraseniaConfirmacionTxt') as FormControl;
  }

  public formularioEncuesta = this.formBuilder.group(
    {
      'nombreTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ]+$')]],
      'apellidoTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ]+$')]],
      'edadTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(99)]],
      'dniTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.minLength(7), Validators.maxLength(8), Validators.pattern('^[0-9]+$')]],
      'obraSocialTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ]+$')]],
      'mailTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)]],
      'contraseniaTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      'contraseniaConfirmacionTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      'fileUnoInput': ['', [Validators.required]],
      'fileDosInput': ['', [Validators.required]],
    }, 
    {validators : this.ValidadorClavesIguales},
  );

  validarEspaciosVacios(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null;
  }

  ValidadorClavesIguales(group: FormGroup): null | object
  {
    const claveIngreso : string = group.get('contraseniaTxt')?.value;
    const claveConfirmacion : string = group.get('contraseniaConfirmacionTxt')?.value;

    if (claveIngreso !== claveConfirmacion)  
    {
      return {'diferente': true};
    }
    else
    {
      return null;
    }
  }

  LimpiarCampos()
  {
    this.NombreTxt.setValue("");
    this.ApellidoTxt.setValue("");
    this.EdadTxt.setValue("");
    this.DniTxt.setValue("");
    this.MailTxt.setValue("");
    this.ContraseniaConfirmacionTxt.setValue("");
    this.ContraseniaTxt.setValue("");
    this.ObraSocialTxt.setValue("");
  }


  async AltaPaciente()
  {
    let arrayFotos: [] | any;
    const fileUnoInput = document.getElementById('fileUnoInput') as HTMLInputElement;
    const fileDosInput = document.getElementById('fileDosInput') as HTMLInputElement;
    
    
    
    let paciente = {
      nombre: this.NombreTxt.value,
      apellido: this.ApellidoTxt.value,
      edad: this.EdadTxt.value,
      obraSocial: this.ObraSocialTxt.value,
      dni: this.DniTxt.value,
      mail: this.MailTxt.value,
      contrasenia:this.ContraseniaTxt.value,
      paths: arrayFotos
    };
    
    try 
    {
      let usuarioNuevo = await  this.firebase.RegistrarCorreoClave(paciente, "paciente");

      if(usuarioNuevo != null )
      {
        if(fileUnoInput && fileDosInput)
        {
          const urls: string[] = [];
    
          const fileUno: FileList | null | any = fileUnoInput.files;
          const fileDos: FileList | null | any  = fileDosInput.files;
    
          const imgUnoRef = ref(this.storage, `pacientes/${paciente.dni}/${fileUno[0].name}`);
          const imgDosRef = ref(this.storage, `pacientes/${paciente.dni}/${fileDos[0].name}`);
    
    
          await uploadBytes(imgUnoRef, fileUno[0]);
          await uploadBytes(imgDosRef, fileDos[0]);
    
          const urlUno = await getDownloadURL(imgUnoRef);
          const urlDos = await getDownloadURL(imgDosRef);
    
          urls.push(urlUno);
          urls.push(urlDos);
          
          paciente.paths = urls;
        
          this.firebase.AgregarAColeccion(paciente, "paciente");
    
          this.notificacionesSweet.MostrarMsjSweetAlert("","Se agrego con exitos", "success");
          this.router.navigateByUrl("bienvenida");  
        }
        else
        {
          this.notificaciones.NotificarConToast('Cargar Fotos', "toast-warning");
        }
      }
      else
      {
        this.notificaciones.NotificarConToast('Ese correo ya se encuentra en nuestros sistemas.', 'toast-info');
      }
    }
    catch(error: any)
    {
      switch (error.code) 
      {
        default:
          this.notificaciones.NotificarConToast('Ese correo ya se encuentra en nuestros sistemas.', 'toast-info');
          break;
      }
    }
  }


}


