import { Routes } from '@angular/router';
import { LandigPage } from './screens/landig-page/landig-page';
import { LoginScreen } from './screens/login-screen/login-screen';
import { Registro } from './partials/registro/registro';

export const routes: Routes = [
  { path: '', component: LandigPage },
  { path: 'login', component: LoginScreen },
  { path: 'register', component: Registro },
  { path: '**', redirectTo: '' },
];
