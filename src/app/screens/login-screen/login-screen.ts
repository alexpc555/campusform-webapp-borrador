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
  hidePassword = true;

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
    alert('🔐 Recuperación de contraseña\n\nSe enviará un enlace a tu correo institucional para restablecer tu contraseña.');
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const credentials: LoginPayload = {
      email: (this.form.value.email || '').trim().toLowerCase(),
      password: (this.form.value.password || '').trim()
    };

    console.log('📤 Intentando login con:', credentials);

    this.auth.login(credentials).subscribe({
      next: (response) => {
        this.submitting = false;
        console.log('✅ Login exitoso:', response);
        // La redirección ya la maneja el AuthService
      },
      error: (err) => {
        this.submitting = false;
        console.error('❌ Error login:', err);
        console.log('📋 Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message
        });
        
        if (err.status === 401 || err.status === 400) {
          const errorData = err.error;
          
          // Verificar mensajes de error específicos del backend
          if (errorData?.email) {
            if (Array.isArray(errorData.email)) {
              this.errorMessage = errorData.email[0];
            } else if (typeof errorData.email === 'string') {
              this.errorMessage = errorData.email;
            } else {
              this.errorMessage = 'Correo electrónico no encontrado.';
            }
          } else if (errorData?.password) {
            if (Array.isArray(errorData.password)) {
              this.errorMessage = errorData.password[0];
            } else if (typeof errorData.password === 'string') {
              this.errorMessage = errorData.password;
            } else {
              this.errorMessage = 'Contraseña incorrecta.';
            }
          } else if (errorData?.detail) {
            this.errorMessage = errorData.detail;
          } else if (errorData?.message) {
            this.errorMessage = errorData.message;
          } else {
            this.errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
          }
          
          console.log('📝 Mensaje de error:', this.errorMessage);
        } else if (err.status === 500) {
          this.errorMessage = 'Error en el servidor. Intenta de nuevo más tarde.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
        }
      }
    });
  }

  // Método para llenar credenciales de prueba (solo desarrollo)
  fillTestCredentials(type: 'student' | 'teacher' | 'admin') {
    const credentials = {
      student: { email: 'alumno@alumno.buap.mx', password: 'Password123' },
      teacher: { email: 'profesor@buap.mx', password: 'Password123' },
      admin: { email: 'admin@admin.buap.mx', password: 'Password123' }
    };
    
    this.form.patchValue(credentials[type]);
    console.log('📝 Credenciales cargadas para:', type);
  }
}