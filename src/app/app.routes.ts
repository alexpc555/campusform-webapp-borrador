import { Routes } from '@angular/router';

import { LandigPage } from './screens/landig-page/landig-page';
import { LoginScreen } from './screens/login-screen/login-screen';
import { Registro } from './partials/registro/registro';
import { ProfesorScreen } from './screens/profesor-screen/profesor-screen';
import { AnalyticsPageComponent } from './screens/analytics-page/analytics-page';
import { DashboardScreen } from './screens/dashboard-screen/dashboard-screen';
import { AdminScreen } from './screens/admin-screen/admin-screen';
import { StudentPanelComponent } from './screens/student-panel/student-panel';
import { GestionUsuario } from './screens/panel-admin-profesor-alumno/gestion-usuario/gestion-usuario';
import { CategoriasAdministracion } from './screens/panel-admin-profesor-alumno/categorias-administracion/categorias-administracion';
import { CategoriasProfesor } from './screens/panel-admin-profesor-alumno/categorias-profesor/categorias-profesor';
import { PostProfesor } from './screens/panel-admin-profesor-alumno/post-profesor/post-profesor';
import { ReportesProfesor } from './screens/panel-admin-profesor-alumno/reportes-profesor/reportes-profesor';
import { ReportesAdmin } from './screens/panel-admin-profesor-alumno/reportes-admin/reportes-admin';
import { ComentariosAlumno } from './screens/panel-admin-profesor-alumno/comentarios-alumno/comentarios-alumno';
import { PostAlumno } from './screens/panel-admin-profesor-alumno/post-alumno/post-alumno';
import { ReportesAlumno } from './screens/panel-admin-profesor-alumno/reportes-alumno/reportes-alumno';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: LandigPage },

  { path: 'login', component: LoginScreen },
  { path: 'register', component: Registro },

  // Rutas de Profesor
  {
    path: 'profesor',
    component: ProfesorScreen,
    canActivate: [authGuard, roleGuard],
    data: { role: 'teacher' }
  },
  {
    path: 'profesor/post',
    component: PostProfesor,
    canActivate: [authGuard, roleGuard],
    data: { role: 'teacher' }
  },
  {
    path: 'profesor/categorias',
    component: CategoriasProfesor,
    canActivate: [authGuard, roleGuard],
    data: { role: 'teacher' }
  },
  {
    path: 'profesor/reportes',
    component: ReportesProfesor,
    canActivate: [authGuard, roleGuard],
    data: { role: 'teacher' }
  },

  // Analytics
  {
  path: 'analytics-page',
  component: AnalyticsPageComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['admin', 'teacher'] }
},

  // Dashboard principal
  {
    path: 'dashboard',
    component: DashboardScreen,
    pathMatch: 'full',
    canActivate: [authGuard]
  },

  // Rutas de Admin
  {
    path: 'admin',
    component: AdminScreen,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/usuarios',
    component: GestionUsuario,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/categorias',
    component: CategoriasAdministracion,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/reportes',
    component: ReportesAdmin,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },

  // Rutas de Estudiante
  {
    path: 'student-panel',
    component: StudentPanelComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },
  {
    path: 'student-panel/post',
    component: PostAlumno,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },
  {
    path: 'student-panel/comentarios',
    component: ComentariosAlumno,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },
  {
    path: 'student-panel/reportes',
    component: ReportesAlumno,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },

  { path: '**', redirectTo: '' }
];