import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ValidatorServices } from '../../services/tools/validator.services';
import { AuthService } from '../../services/auth.services';

type Role = 'student' | 'teacher' | 'admin';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro implements OnInit {
  submitting = false;
  form!: FormGroup;
  registerError: string = '';
  registerSuccess: boolean = false;

  // Mapa de dominios para mostrar en mensajes de error
  domainMap = {
    student: '@alumno.buap.mx',
    teacher: '@buap.mx',
    admin: '@admin.buap.mx'
  };

  // Mapa de nombres de roles en español
  roleNames = {
    student: 'estudiante',
    teacher: 'profesor',
    admin: 'administrador'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validators: ValidatorServices,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        name: ['', [
          Validators.required,
          this.validators.validName()
        ]],
        email: ['', [
          Validators.required
        ]],
        role: ['student' as Role, [Validators.required]],
        password: ['', [
          Validators.required,
          this.validators.strongPassword()
        ]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [
        this.validators.matchFields('password', 'confirmPassword')
      ]}
    );

    // Escuchar cambios en el rol para actualizar la validación del email
    this.form.get('role')?.valueChanges.subscribe(() => {
      this.form.get('email')?.updateValueAndValidity();
    });

    // Aplicar validador condicional al email
    this.setupEmailValidator();
  }

  setupEmailValidator() {
    const roleControl = this.form.get('role');
    const emailControl = this.form.get('email');

    if (emailControl) {
      emailControl.setValidators([
        Validators.required,
        this.validators.emailByRole(roleControl)
      ]);
      emailControl.updateValueAndValidity();
    }
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get role() { return this.form.get('role'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  // Obtener el placeholder para el email según el rol
  getEmailPlaceholder(): string {
    const roleValue = this.role?.value as Role;
    if (roleValue && this.domainMap[roleValue]) {
      return `ejemplo${this.domainMap[roleValue]}`;
    }
    return 'correo@dominio.com';
  }

  // Obtener mensaje de error específico para email según el rol
  getEmailErrorMessage(): string {
    const emailControl = this.email;
    const roleValue = this.role?.value as Role;

    if (emailControl?.touched && emailControl?.errors) {
      if (emailControl.errors['required']) {
        return 'El correo es requerido';
      }
      if (emailControl.errors['invalidEmailForRole'] && roleValue) {
        const expectedDomain = this.domainMap[roleValue];
        const roleName = this.roleNames[roleValue];
        return `Los ${roleName}s deben usar correo ${expectedDomain}`;
      }
    }
    return '';
  }

  getPasswordErrors(): string[] {
    const errors: string[] = [];
    const passwordControl = this.password;
    
    if (passwordControl?.touched && passwordControl?.errors) {
      if (passwordControl.errors['required']) {
        errors.push('La contraseña es requerida');
      }
      if (passwordControl.errors['weakPassword']) {
        const weakErrors = passwordControl.errors['weakPassword'];
        if (weakErrors['minLength']) {
          errors.push('Mínimo 8 caracteres');
        }
        if (weakErrors['missingUppercase']) {
          errors.push('Debe tener al menos una mayúscula');
        }
        if (weakErrors['missingNumber']) {
          errors.push('Debe tener al menos un número');
        }
      }
    }
    return errors;
  }

  // Calcular fortaleza de la contraseña (0-100)
  getPasswordStrength(): number {
    const password = this.password?.value || '';
    if (!password) return 0;
    
    let strength = 0;
    
    // Longitud
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    
    // Mayúsculas
    if (/[A-Z]/.test(password)) strength += 20;
    
    // Números
    if (/[0-9]/.test(password)) strength += 20;
    
    // Caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    return Math.min(strength, 100);
  }

  // Obtener texto de fortaleza
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength === 0) return '';
    if (strength < 40) return 'Débil';
    if (strength < 70) return 'Media';
    return 'Fuerte';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.registerError = '';
    this.registerSuccess = false;

    const payload = {
      name: (this.form.value.name || '').trim(),
      email: (this.form.value.email || '').trim().toLowerCase(),
      password: (this.form.value.password || '').trim(),
      role: this.form.value.role as Role,
    };

    console.log('📤 Enviando registro:', payload);

    this.auth.register(payload).subscribe({
      next: (response) => {
        console.log('✅ Registro exitoso:', response);
        this.submitting = false;
        this.registerSuccess = true;
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.submitting = false;
        console.error('❌ Error en registro:', err);
        
        if (err.status === 400) {
          const errorData = err.error;
          
          if (errorData.email) {
            if (Array.isArray(errorData.email)) {
              this.registerError = errorData.email[0];
            } else {
              this.registerError = 'El correo electrónico ya está registrado.';
            }
          } else if (errorData.password) {
            if (Array.isArray(errorData.password)) {
              this.registerError = errorData.password[0];
            } else {
              this.registerError = 'La contraseña no cumple con los requisitos de seguridad.';
            }
          } else if (errorData.name) {
            if (Array.isArray(errorData.name)) {
              this.registerError = errorData.name[0];
            } else {
              this.registerError = 'El nombre contiene caracteres no permitidos.';
            }
          } else if (errorData.role) {
            if (Array.isArray(errorData.role)) {
              this.registerError = errorData.role[0];
            } else {
              this.registerError = 'El rol seleccionado no es válido.';
            }
          } else {
            this.registerError = 'Error en los datos del formulario. Verifica la información.';
          }
        } else if (err.status === 401) {
          this.registerError = 'Error de autenticación. Contacta al administrador.';
        } else if (err.status === 500) {
          this.registerError = 'Error en el servidor. Intenta de nuevo más tarde.';
        } else if (err.status === 0) {
          this.registerError = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8000';
        } else {
          this.registerError = 'Error al crear la cuenta. Intenta de nuevo.';
        }
      }
    });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}