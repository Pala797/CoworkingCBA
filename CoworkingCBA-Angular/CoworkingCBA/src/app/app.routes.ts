import { Routes, provideRouter } from '@angular/router';
import { PaginaPrincipalComponent } from './pages/pagina-principal/pagina-principal.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { NavComponent } from './pages/nav/nav.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AuthGuard } from '../service/auth/AuthGuard';
import { UnAuthGuard } from '../service/auth/UnAuthGuard';

export const routes: Routes = [
    { path: '', component: PaginaPrincipalComponent },
    { path: 'catalogo', component: CatalogoComponent, canActivate: [AuthGuard] },
    { path: 'nav', component: NavComponent },
    { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard] },
    { path: 'registro', component: RegistroComponent, canActivate: [UnAuthGuard] },
  ];

export const AppRoutingModule = provideRouter(routes);
