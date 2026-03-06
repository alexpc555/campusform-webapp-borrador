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
import { CategoriasScreen } from './screens/categorias/categorias-screen/categorias-screen';
import { FisicaComponent } from './screens/categorias/fisica/fisica';
import { InglesComponent } from './screens/categorias/ingles/ingles';
import { MatematicasComponent } from './screens/categorias/matematicas/matematicas';
import { ProgramacionComponent } from './screens/categorias/programacion/programacion';
import { GuardadosComponent } from './screens/dashboard-secciones/guardados/guardados';
import { MisPostsComponent } from './screens/dashboard-secciones/mis-posts/mis-posts';
import { PopularesComponent } from './screens/dashboard-secciones/populares/populares';
import { ComentariosAlumno } from './screens/panel-admin-profesor-alumno/comentarios-alumno/comentarios-alumno';
import { PostAlumno } from './screens/panel-admin-profesor-alumno/post-alumno/post-alumno';
import { ReportesAlumno } from './screens/panel-admin-profesor-alumno/reportes-alumno/reportes-alumno';


export const routes: Routes = [

  { path: '', component: LandigPage },

  { path: 'login', component: LoginScreen },

  { path: 'register', component: Registro },

  { path: 'profesor', component: ProfesorScreen },
  { path: 'profesor/post', component: PostProfesor },
  { path: 'profesor/categorias', component: CategoriasProfesor },
  { path: 'profesor/reportes', component: ReportesProfesor },

  { path: 'analytics-page', component: AnalyticsPageComponent },

  { path: 'dashboard', component: DashboardScreen, pathMatch: 'full' },
  { path: 'dashboard/categoria/fisica', component: FisicaComponent },
  { path: 'dashboard/categoria/ingles', component: InglesComponent },
  { path: 'dashboard/categoria/matematicas', component: MatematicasComponent },
  { path: 'dashboard/categoria/programacion', component: ProgramacionComponent },

  { path: 'dashboard/mis-posts', component: MisPostsComponent },
  { path: 'dashboard/populares', component: PopularesComponent },
  { path: 'dashboard/guardados', component: GuardadosComponent },



  { path: 'admin', component: AdminScreen },

  { path: 'student-panel', component: StudentPanelComponent },
  { path: 'student-panel/post', component: PostAlumno },
  { path: 'student-panel/comentarios', component: ComentariosAlumno },
  { path: 'student-panel/reportes', component: ReportesAlumno },

  { path: 'admin/usuarios', component: GestionUsuario },
  { path: 'admin/categorias', component: CategoriasAdministracion },
  { path: 'admin/reportes', component: ReportesAdmin },
  { path: '**', redirectTo: '' }

];
