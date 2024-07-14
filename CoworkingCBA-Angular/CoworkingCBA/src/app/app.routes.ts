import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { PaginaPrincipalComponent } from './pages/pagina-principal/pagina-principal.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { NavComponent } from './pages/nav/nav.component';

export const routes: Routes = [


    {path:'', component:PaginaPrincipalComponent},
    { path: 'catalogo', component: CatalogoComponent },
    { path: 'nav', component: NavComponent },
    


];
export class AppRoutingModule { }