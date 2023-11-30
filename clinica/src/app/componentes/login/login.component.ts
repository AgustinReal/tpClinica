import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import {SweetalertService} from "src/app/servicios/sweetalert.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  obser$: any;
  obser2$: any;
  esTexto: boolean = false;
  password:string ="";
  correoTxt:string="";
  imagenOjo:string="../../../assets/imagenes/login/ojo/ojooCerrado.png";
  nombreUser: string="";
  array: any=[];

  constructor(private firebase:FirebaseService, private router: Router, private notificaciones: NotificacionesService, private notificacionesSweet: SweetalertService)
  {

  }

  ngOnInit() {

    
  }

  ngOnDestroy() {

  }

  togglePasswordVisibility()
  {
    this.esTexto = !this.esTexto;

    if(this.esTexto == true)
    {
      this.imagenOjo = "../../../assets/imagenes/login/ojo/ojoo.png";
    }
    else
    {
      this.imagenOjo = "../../../assets/imagenes/login/ojo/ojooCerrado.png";
    }
  }

  LimpiarCampos()
  {
    this.correoTxt ="";
    this.password ="";
  }

  async Ingreso()
  {
    console.log("entre");
    try 
    {

      let auxRol: string = "";

      this.obser$ =  this.firebase.TraerUsuarios().subscribe(datos =>{
        auxRol = this.BuscarRol(datos);
      });

      this.obser$.unsubscribe();

      

      if(await this.firebase.ConsultarEspecialidastaEstaHabilitado(this.correoTxt))
      {
        console.log("no esta habilitado");
        this.notificaciones.NotificarConToast('El usuario especialista no se encuentra habilitado por un admin.', "toast-warning");
      }
      else
      {
        if(this.correoTxt == "octavio@octavio.com" || this.correoTxt == "agustin@agustin.com")
        {
          auxRol = "administrador";
        }
  
        const user = await  this.firebase.IniciarSesionCorreoClave(this.correoTxt, this.password, auxRol);

        console.log(user);
  
        if (user !=true)
        {
          this.notificaciones.NotificarConToast('Se requiere verificar el correo, revisar tu bandeja en tu mail..', "toast-info");
        }
        else
        {
          this.firebase.GuardarRegistro(this.correoTxt, auxRol);
          this.notificacionesSweet.MostrarMsjSweetAlert("","Bienvenido", "success");
          this.router.navigateByUrl("bienvenida");  
        }
      }

    }
    catch(error: any)
    {
      switch (error.code) 
      {
        case 'auth/user-not-found':
          this.notificaciones.NotificarConToast('El usuario no se encuentra registrado.', "toast-warning");
          break;
        case 'auth/wrong-password':
          this.notificaciones.NotificarConToast('La contraseña es incorrecta.', "toast-warning");
          break;
        case "auth/invalid-login-credentials":
          this.notificaciones.NotificarConToast('El usuario no se encuentra registrado.', "toast-warning");
           break;
        default:
          this.notificaciones.NotificarConToast('Llene ambos campos correo electronico y clave', 'toast-error');
          break;
      }
    }
  }



  BuscarRol(arrayAux: Array<any>): string
  {
    let rol: string ="";

    for (let i = 0; i < arrayAux.length; i++) 
    {
      if(this.correoTxt == arrayAux[i].correo)
      {
        rol = arrayAux[i].tipoRegistro;
      }
    }
    
    return rol;
  }

  atrapado($event: any)
  {
    this.correoTxt = $event.mail;
    this.password = $event.contrasenia;
  }

}
