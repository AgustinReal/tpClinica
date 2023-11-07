import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { ControlUsuariosComponent } from './componentes/control-usuarios/control-usuarios.component';
import { adminGuard } from './guards/administrador.guard';

const routes: Routes = [
  {path:"bienvenida", component:BienvenidaComponent},
  {path:"ingreso", title:"Incio sesion", component:LoginComponent},
  {path:"registro", title:"Registrarte", component:RegistroComponent},
  {path:"administracionUsuarios", component:ControlUsuariosComponent, canActivate:[adminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
