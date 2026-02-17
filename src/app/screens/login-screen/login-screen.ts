import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { ValidatorServices } from '../../services/tools/validator.services';
import { Router } from '@angular/router';


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

  constructor(
    private fb: FormBuilder,
    private validators: ValidatorServices,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, this.validators.institutionalEmail()]],
      password: ['', [Validators.required, this.validators.minLengthTrim(6)]],
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  forgotPassword() {
  alert('Recuperación de contraseña pendiente');
}


submit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.submitting = true;

  setTimeout(() => {
    this.submitting = false;


    localStorage.setItem('userType', 'Alumno');

    // mandar al dashboard
    this.router.navigate(['/dashboard']);
  }, 400);
}

}
