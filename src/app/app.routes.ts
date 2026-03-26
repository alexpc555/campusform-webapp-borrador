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

export const routes: Routes = [

  { path: '', component: LandigPage },

  { path: 'login', component: LoginScreen },

  { path: 'register', component: Registro },

  // Rutas de Profesor
  { path: 'profesor', component: ProfesorScreen },
  { path: 'profesor/post', component: PostProfesor },
  { path: 'profesor/categorias', component: CategoriasProfesor },
  { path: 'profesor/reportes', component: ReportesProfesor },

  // Analytics
  { path: 'analytics-page', component: AnalyticsPageComponent },

  // Dashboard principal (con todo integrado)
  { path: 'dashboard', component: DashboardScreen, pathMatch: 'full' },

  // Rutas de Admin
  { path: 'admin', component: AdminScreen },
  { path: 'admin/usuarios', component: GestionUsuario },
  { path: 'admin/categorias', component: CategoriasAdministracion },
  { path: 'admin/reportes', component: ReportesAdmin },

  // Rutas de Estudiante
  { path: 'student-panel', component: StudentPanelComponent },
  { path: 'student-panel/post', component: PostAlumno },
  { path: 'student-panel/comentarios', component: ComentariosAlumno },
  { path: 'student-panel/reportes', component: ReportesAlumno },

  // Redirección por defecto
  { path: '**', redirectTo: '' }

];