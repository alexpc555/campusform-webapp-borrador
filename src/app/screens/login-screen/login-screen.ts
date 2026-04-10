import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ValidatorServices } from '../../services/tools/validator.services';
import { AuthService, LoginPayload } from '../../services/auth.services';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss',
})
export class LoginScreen {
  submitting = false;
  form!: FormGroup;
  errorMessage: string = '';
  hidePassword = true; // Para mostrar/ocultar contraseña

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validators: ValidatorServices,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validators.institutionalEmail()]],
      password: ['', [Validators.required, this.validators.minLengthTrim(6)]],
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  forgotPassword() {
    alert(' Recuperación de contraseña\n\nSe enviará un enlace a tu correo institucional para restablecer tu contraseña.');
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const credentials: LoginPayload = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.auth.login(credentials).subscribe({
      next: (response) => {
        this.submitting = false;
        console.log(' Login exitoso:', response);
      },
      error: (err) => {
        this.submitting = false;
        console.error(' Error login:', err);
        
        // Analizar el error para mostrar mensajes específicos
        if (err.status === 401 || err.status === 400) {
          const errorData = err.error;
          
          // Verificar si el error es por email no encontrado
          if (errorData?.email || (errorData && typeof errorData === 'object' && errorData.email)) {
            this.errorMessage = ' No existe una cuenta con este correo electrónico.';
            alert(' USUARIO NO ENCONTRADO\n\nNo existe una cuenta con el correo: ' + credentials.email + '\n\nVerifica que hayas escrito correctamente tu correo institucional.');
          } 
          // Verificar si el error es por contraseña incorrecta
          else if (errorData?.password || (errorData && typeof errorData === 'object' && errorData.password)) {
            this.errorMessage = ' Contraseña incorrecta. Intenta de nuevo.';
            alert(' CONTRASEÑA INCORRECTA\n\nLa contraseña ingresada no es correcta.\n\nVerifica tu contraseña e intenta nuevamente.');
          }
          // Error genérico de credenciales
          else {
            this.errorMessage = ' Credenciales inválidas. Verifica tu correo y contraseña.';
            alert(' CREDENCIALES INVÁLIDAS\n\nEl correo o la contraseña son incorrectos.\n\nPor favor, verifica tus datos e intenta nuevamente.');
          }
        } else if (err.status === 500) {
          this.errorMessage = ' Error en el servidor. Intenta de nuevo más tarde.';
          alert(' ERROR EN EL SERVIDOR\n\nOcurrió un error en el servidor.\n\nPor favor, intenta de nuevo más tarde.');
        } else if (err.status === 0) {
          this.errorMessage = ' No se pudo conectar con el servidor. Verifica tu conexión.';
          alert(' ERROR DE CONEXIÓN\n\nNo se pudo conectar con el servidor.\n\nVerifica que el backend esté corriendo en http://localhost:8000');
        } else {
          this.errorMessage = ' Error al iniciar sesión. Intenta de nuevo.';
          alert(' ERROR DE AUTENTICACIÓN\n\nOcurrió un error al intentar iniciar sesión.\n\nPor favor, intenta de nuevo más tarde.');
        }
      }
    });
  }
}