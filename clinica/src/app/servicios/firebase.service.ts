import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { formatDate } from '@angular/common';
import { SweetalertService } from './sweetalert.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  estaLogueado : boolean = false;
  esAdmin: boolean = false;


  constructor(private router: Router, private auth: AngularFireAuth, private firestore: AngularFirestore, private angularFireStorage: AngularFireStorage, private notificacionesSweet: SweetalertService) {

  }

async IniciarSesionCorreoClave(email: string, clave: string, rol: string): Promise<boolean | undefined>  {
    let estaOk : boolean | undefined = false ;
    
    let dato =  await this.auth.signInWithEmailAndPassword(email, clave);

      if(email == "octavio@octavio.com" || email == "agustin@agustin.com")
      {
        this.esAdmin = true;
        this.estaLogueado = true;
        return true;
      }

      estaOk =  dato.user?.emailVerified;

      console.log(estaOk);

      if(estaOk == true)
      {
        this.estaLogueado = true;

        if(rol == "administrador")
        {
          this.esAdmin = true;
        }

        return true;
      }
      else if(estaOk == undefined)
      {
        this.estaLogueado = false;

        return undefined;
      }
      else 
      {
        this.estaLogueado = false;
        return false;
      }
  }

  CerrarSesion()
  {
    this.estaLogueado = false;
    this.esAdmin = false;
    this.auth.signOut();
    this.notificacionesSweet.MostrarMsjSweetAlert("", "Sesion cerrada", "info");
    this.router.navigateByUrl("bienvenida");
  }

  async RegistrarCorreoClave(usuario: any, tipoRegistroAux: string) {

    try 
    {
      const dato = await this.auth.createUserWithEmailAndPassword(usuario.mail, usuario.contrasenia);
      if (dato.user != null)
      {
        const uId = dato.user.uid;
        const documento = this.firestore.doc("usuarios/" + uId);
        
        await documento.set({
          uId: uId,
          nombre: usuario.nombre,
          correo: usuario.mail,
          clave: usuario.contrasenia,
          tipoRegistro: tipoRegistroAux,
        });
  
        await dato.user.sendEmailVerification();
        return dato;
      }
      else 
      {
        return null;
      }
    }
    catch (error) 
    {
      console.log("Error atrapado", error);
      return null;
    }
  }

  AgregarAColeccion(objData: any, coleccion: string) {
    return this.firestore.collection(coleccion).add(objData).then(() => {

    }).catch((error: any) => {
      console.log(error);
    });
  }


  TraerEspecialidades() {
    const coleccion = this.firestore.collection('especialidades', ref =>
      ref.orderBy("especialidad", "asc")
    );
    return coleccion.valueChanges();
  }

  TraerPacientes() {
    const coleccion = this.firestore.collection('paciente', ref =>
      ref.orderBy("apellido", "asc")
    );
    return coleccion.valueChanges();
  }

  async ConsultarEspecialidadExiste(especialidad: string): Promise<boolean> {
    const query = this.firestore.collection("especialidades", ref => ref.where("especialidad", "==", especialidad).limit(1));
    const querySnapshot = await query.get().toPromise();
    const existe = !querySnapshot?.empty;
    return existe;
  }

  async ConsultarEspecialidastaEstaHabilitado(mail: string): Promise<boolean> {
    const query = this.firestore.collection("especialistas", ref => ref.where("mail", "==", mail).where("loginHabilitado", "==", false).limit(1));
    const querySnapshot = await query.get().toPromise();
    const existe = !querySnapshot?.empty;
    return existe;
  }

  TraerEspecialistas() {
    const coleccion = this.firestore.collection('especialistas', ref =>
      ref.orderBy("especialidad", "asc")
    );
    return coleccion.valueChanges();
  }

  TraerUsuarios()
  {
    const coleccion = this.firestore.collection('usuarios');
    return coleccion.valueChanges();
  }


  ModificarUsuarioEspecialista(objContainer: any, atributo: string, valor: boolean): Promise<void> {
    const query = this.firestore.collection("especialistas", ref => ref.where("dni", "==", objContainer.dni).limit(1));

    return query.get().toPromise()
      .then((querySnapshot: any) => {
        if (!querySnapshot.empty) {
          const documentoId = querySnapshot.docs[0].id;

          const documentRef = this.firestore.collection('especialistas').doc(documentoId);

          let data = {
            ...querySnapshot.docs[0].data,
            [atributo]: valor
          }

          return documentRef.update(data);
        }
        else {
          console.log('No se encontró ningún documento con el atributo y valor especificado.');
          return Promise.reject();
        }
      });
  }

}
