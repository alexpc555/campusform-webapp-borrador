import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ValidatorServices } from '../../services/tools/validator.services';

type Role = 'student' | 'teacher';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  submitting = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private validators: ValidatorServices
  ) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, this.validators.institutionalEmailNoAdmin()]],
        role: ['student' as Role, [Validators.required]],
        password: ['', [Validators.required, this.validators.minLengthTrim(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.validators.matchFields('password', 'confirmPassword')] }
    );
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get role() { return this.form.get('role'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const role = this.form.value.role as Role;
    const userType = role === 'student' ? 'Alumno' : 'Profesor';

    // Mock: guardar y mandar a login (o dashboard cuando exista)
    localStorage.setItem('userType', userType);
    localStorage.setItem('userEmail', (this.form.value.email || '').trim());
    localStorage.setItem('userName', (this.form.value.name || '').trim());

    setTimeout(() => {
      this.submitting = false;
      // Como aún no hay dashboard, te mando a login
      this.router.navigate(['/login']);
    }, 500);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
