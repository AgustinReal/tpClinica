import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { ToastrModule } from 'ngx-toastr';
import { BarraComponent } from './componentes/barra/barra.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { TablaEspecialidadesComponent } from './componentes/tabla-especialidades/tabla-especialidades.component';
import { AltaEspecialistaComponent } from './componentes/registros/alta-especialista/alta-especialista.component';
import { ControlUsuariosComponent } from './componentes/control-usuarios/control-usuarios.component';
import { AltaAdministradorComponent } from './componentes/registros/alta-administrador/alta-administrador.component';
import { MenuPacientesComponent } from './componentes/menus/menu-pacientes/menu-pacientes.component';
import { SolicitarTurnosComponent } from './componentes/menus/turnos/solicitar-turnos/solicitar-turnos.component';
import { PerfilPacienteComponent } from './componentes/menus/perfiles/perfil-paciente/perfil-paciente.component';
import { PerfilEspecialistaComponent } from './componentes/menus/perfiles/perfil-especialista/perfil-especialista.component';
import { MisTurnosComponent } from './componentes/menus/turnos/mis-turnos/mis-turnos.component';
import { DatePipe } from '@angular/common';
import { MisTurnosEspecialistaComponent } from './componentes/menus/mis-turnos-especialista/mis-turnos-especialista.component';
import { TurnosAdministradorComponent } from './componentes/menus/turnos-administrador/turnos-administrador.component';
import { SolicitarTurnosAdminComponent } from './componentes/menus/turnos/solicitar-turnos-admin/solicitar-turnos-admin.component';
import { AccesoRapidosComponent } from './componentes/acceso-rapidos/acceso-rapidos.component';
import { GraficosComponent } from './componentes/graficos/graficos.component';
import { CambiarColorBotonDirective } from './directivas/cambiar-color-boton.directive';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    RegistroComponent,
    BarraComponent,
    TablaEspecialidadesComponent,
    AltaEspecialistaComponent,
    ControlUsuariosComponent,
    AltaAdministradorComponent,
    MenuPacientesComponent,
    SolicitarTurnosComponent,
    PerfilPacienteComponent,
    PerfilEspecialistaComponent,
    MisTurnosComponent,
    MisTurnosEspecialistaComponent,
    TurnosAdministradorComponent,
    SolicitarTurnosAdminComponent,
    AccesoRapidosComponent,
    GraficosComponent,
    CambiarColorBotonDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ReactiveFormsModule,
    ToastrModule.forRoot(),
  ],
  providers: [[DatePipe]],
  bootstrap: [AppComponent]
})
export class AppModule { }
