import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteComponent } from './paciente.component';
import { SolicitarTurnosComponent } from 'src/app/componentes/menus/turnos/solicitar-turnos/solicitar-turnos.component';
import { PerfilPacienteComponent } from 'src/app/componentes/menus/perfiles/perfil-paciente/perfil-paciente.component';
import { MisTurnosComponent } from 'src/app/componentes/menus/turnos/mis-turnos/mis-turnos.component';

const routes: Routes = [{ path: '', component: PacienteComponent,
children:[
  {path: "sacarTurno", component:SolicitarTurnosComponent},
  {path: "perfil", component:PerfilPacienteComponent},
  {path: "misTurnos", component:MisTurnosComponent}
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
