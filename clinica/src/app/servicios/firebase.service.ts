import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { formatDate } from '@angular/common';
import { SweetalertService } from './sweetalert.service';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  estaLogueado : boolean = false;
  correoLogueado: string = "";
  esAdmin: boolean = false;


  constructor(private router: Router, private auth: AngularFireAuth, private firestore: AngularFirestore, private angularFireStorage: AngularFireStorage, private notificacionesSweet: SweetalertService) {

  }

async IniciarSesionCorreoClave(email: string, clave: string, rol: string): Promise<boolean | undefined>  {
    let estaOk : boolean | undefined = false ;
    
    let dato =  await this.auth.signInWithEmailAndPassword(email, clave);

    this.correoLogueado = email;

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
    this.correoLogueado = "";
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

        console.log("entree");
        
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
    console.log("entreee agragar especialidad");
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

  async ConsultarTurnoNoOcupado(turno: any): Promise<boolean> {
    const query = this.firestore.collection("turnos", ref => ref.where("dia", "==", turno.dia)
                                                                .where("doctor.mail", "==", turno.doctor.mail)
                                                                .where("horario", "==", turno.horario)
                                                                .where("paciente.mail","==", turno.paciente.mail)
                                                                .where("especialista" , "==" , turno.especialista).limit(1));
    const querySnapshot = await query.get().toPromise();
    const existe = !querySnapshot?.empty;
    return existe;
  }

  async ConsultarTurnoNoParaPacienteNoIgual(paciente: any): Promise<boolean> {
    const query = this.firestore.collection("paciente", ref => ref.where("turno", "==", paciente).limit(1));
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

  TrearTurnos()
  {
    const coleccion = this.firestore.collection('turnos');
    return coleccion.valueChanges();
  }

  TrearLogs()
  {
    const coleccion = this.firestore.collection('logs');
    return coleccion.valueChanges();
  }

  TrearAccesosRapidos()
  {
    const coleccion = this.firestore.collection('accesoRapidos', ref =>
    ref.orderBy("perfil", "asc")
    );
    return coleccion.valueChanges();
  }

  ModificarUsuario(coleccion: string, objContainer: any, atributo: string, valor: any): Promise<void> {
    const query = this.firestore.collection(coleccion, ref => ref.where("mail", "==", objContainer.mail).limit(1));

    return query.get().toPromise()
      .then((querySnapshot: any) => {
        if (!querySnapshot.empty) {
          const documentoId = querySnapshot.docs[0].id;

          const documentRef = this.firestore.collection(coleccion).doc(documentoId);

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

  ModificarTurno(coleccion: string, objContainer: any, atributo: string, valor: any): Promise<void> {
    const query = this.firestore.collection(coleccion, ref => ref.where("dia", "==", objContainer.dia)
                                                                  .where("horario", "==", objContainer.horario)
                                                                  .where("especialista", "==", objContainer.especialista)
                                                                  .limit(1));

    return query.get().toPromise()
      .then((querySnapshot: any) => {
        if (!querySnapshot.empty) {
          const documentoId = querySnapshot.docs[0].id;

          const documentRef = this.firestore.collection(coleccion).doc(documentoId);

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

  GuardarRegistro(mail: string, usuarioAux: any)
  {
    let objetoJSData = { mail: mail,
                         fecha: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'
    ) };

    return this.firestore.collection("logs").add(objetoJSData)
  }

}
