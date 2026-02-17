import { Routes } from '@angular/router';

import { LandigPage } from './screens/landig-page/landig-page';
import { LoginScreen } from './screens/login-screen/login-screen';
import { Registro } from './partials/registro/registro';
import { ProfesorScreen } from './screens/profesor-screen/profesor-screen';
import { AnalyticsPageComponent } from './screens/analytics-page/analytics-page';

export const routes: Routes = [

  { path: '', component: LandigPage, pathMatch: 'full' },

  { path: 'login', component: LoginScreen },

  { path: 'register', component: Registro },

  { path: 'profesor', component: ProfesorScreen },

  { path: 'analytics-page', component: AnalyticsPageComponent },

  { path: '**', redirectTo: '' },

];