import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { ControlUsuariosComponent } from './componentes/control-usuarios/control-usuarios.component';
import { adminGuard } from './guards/administrador.guard';
import { TurnosAdministradorComponent } from './componentes/menus/turnos-administrador/turnos-administrador.component';
import { SolicitarTurnosAdminComponent } from './componentes/menus/turnos/solicitar-turnos-admin/solicitar-turnos-admin.component';

const routes: Routes = [
  {path:"", component:BienvenidaComponent},
  {path:"bienvenida", component:BienvenidaComponent},
  {path:"ingreso", title:"Incio sesion", component:LoginComponent},
  {path:"registro", title:"Registrarte", component:RegistroComponent},
  {path:"administracionUsuarios", component:ControlUsuariosComponent, canActivate:[adminGuard]},
  {path:"administracionPerfiles", component: TurnosAdministradorComponent, canActivate:[adminGuard]},
  {path:"administracionSacarTurno", component: SolicitarTurnosAdminComponent,canActivate:[adminGuard]},

  //crear children
  { path: 'paciente', loadChildren: () => import('./modulos/paciente/paciente.module').then(m => m.PacienteModule) },
  { path: 'especialista', loadChildren: () => import('./modulos/especialista/especialista.module').then(m => m.EspecialistaModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
