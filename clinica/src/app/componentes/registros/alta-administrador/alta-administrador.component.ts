import { Component, } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-administrador',
  templateUrl: './alta-administrador.component.html',
  styleUrls: ['./alta-administrador.component.css']
})
export class AltaAdministradorComponent {
  titulo: string = "Seleccionar Paciente o Especialista";
  seleccionoDif: boolean = false;
  boolPaciente: boolean = false;
  boolEspecialista: boolean = false;
  foto1Url: string = '../../../assets/imagenes/registro/altaPaciente/clinicaIngreseFoto.png';
  file: any;
  formFotos: any;
  especialidadRecuperada: string = "";
  seEligioEspecialidad: boolean = false;
 

  constructor(private formBuilder: FormBuilder,private router: Router , public firebase: FirebaseService, private notificacionesSweet: SweetalertService, private notificaciones: NotificacionesService, private storage: Storage) { }

   ngOnInit() {

  }

  ngOnDestroy() {

  }

  get NombreTxt() {
    return this.formularioAdministrador.get("nombreTxt") as FormControl;
  }

  get ApellidoTxt() {
    return this.formularioAdministrador.get("apellidoTxt") as FormControl;
  }

  get EdadTxt() {
    return this.formularioAdministrador.get("edadTxt") as FormControl;
  }

  get DniTxt() {
    return this.formularioAdministrador.get("dniTxt") as FormControl;
  }

  get MailTxt() {
    return this.formularioAdministrador.get("mailTxt") as FormControl;
  }

  get ContraseniaTxt() {
    return this.formularioAdministrador.get("contraseniaTxt") as FormControl;
  }

  get ContraseniaConfirmacionTxt() {
    return this.formularioAdministrador.get('contraseniaConfirmacionTxt') as FormControl;
  }


  public formularioAdministrador = this.formBuilder.group
    (
      {
        'nombreTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ]+$')]],
        'apellidoTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ]+$')]],
        'edadTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(99)]],
        'dniTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.minLength(7), Validators.maxLength(8), Validators.pattern('^[0-9]+$')]],
        'mailTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)]],
        'contraseniaTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
        'contraseniaConfirmacionTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
        'fileUnoInput': ['', [Validators.required]],
      },
      { validators: this.ValidadorClavesIguales },

    );


  validarEspaciosVacios(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null;
  }

  ValidadorClavesIguales(group: FormGroup): null | object {
    const claveIngreso: string = group.get('contraseniaTxt')?.value;
    const claveConfirmacion: string = group.get('contraseniaConfirmacionTxt')?.value;

    if (claveIngreso !== claveConfirmacion) {
      return { 'diferente': true };
    }
    else {
      return null;
    }
  }

  async AltaAdministrador() {
    let arrayFotos: [] | any;
    const fileUnoInput = document.getElementById('fileUnoInput') as HTMLInputElement;


    let administrador = {
      nombre: this.NombreTxt.value,
      apellido: this.ApellidoTxt.value,
      edad: this.EdadTxt.value,
      dni: this.DniTxt.value,
      mail: this.MailTxt.value,
      contrasenia: this.ContraseniaTxt.value,
      paths: arrayFotos
    };

    try 
    {
      let usuarioNuevo = await this.firebase.RegistrarCorreoClave(administrador, "administrador");

      if (usuarioNuevo != null) 
      {

        if (fileUnoInput) 
        {
          const urls: string[] = [];

          const fileUno: FileList | null | any = fileUnoInput.files;

          const imgUnoRef = ref(this.storage, `administradores/${administrador.dni}/${fileUno[0].name}`);


          uploadBytes(imgUnoRef, fileUno[0]);

          const urlUno = await getDownloadURL(imgUnoRef);

          urls.push(urlUno);

          administrador.paths = urls;

          this.firebase.AgregarAColeccion(administrador, "administradores");

          this.notificacionesSweet.MostrarMsjSweetAlert("", "Se agrego con exitos", "success");

          this.router.navigateByUrl("bienvenida");  

        }
        else {
          this.notificaciones.NotificarConToast('Cargar Fotos', "toast-warning");
        }
      }
      else {
        this.notificaciones.NotificarConToast('Ese correo ya se encuentra en nuestros sistemas.', 'toast-info');
      }


    }
    catch (error: any) {
      console.log("entre", error);
      switch (error.code) {
        default:
          this.notificaciones.NotificarConToast('Ese correo ya se encuentra en nuestros sistemas.', 'toast-info');
          break;
      }
    }
  }



  LimpiarCampos() {
    this.NombreTxt.setValue("");
    this.ApellidoTxt.setValue("");
    this.EdadTxt.setValue("");
    this.DniTxt.setValue("");
    this.MailTxt.setValue("");
    this.ContraseniaConfirmacionTxt.setValue("");
    this.ContraseniaTxt.setValue("");
  }
}
