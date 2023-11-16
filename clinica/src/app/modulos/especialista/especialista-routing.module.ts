import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspecialistaComponent } from './especialista.component';
import { PerfilEspecialistaComponent } from 'src/app/componentes/menus/perfiles/perfil-especialista/perfil-especialista.component';
import { MisTurnosEspecialistaComponent } from 'src/app/componentes/menus/mis-turnos-especialista/mis-turnos-especialista.component';

const routes: Routes = [{ path: '', component: EspecialistaComponent, 
children:[
  {path: "perfil", component:PerfilEspecialistaComponent},
  {path: "misTurnosEspecialista", component:MisTurnosEspecialistaComponent},
] 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspecialistaRoutingModule { }
