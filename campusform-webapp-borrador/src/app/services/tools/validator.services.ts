import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorServices {

  // Login: alumno | buap | admin
  private readonly institutionalEmailRegex =
    /^[^\s@]+@(alumno\.buap\.mx|buap\.mx|admin\.buap\.mx)$/i;

  // Register: alumno | buap (SIN admin)
  private readonly institutionalEmailNoAdminRegex =
    /^[^\s@]+@(alumno\.buap\.mx|buap\.mx)$/i;

  institutionalEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString().trim();
      if (!value) return null;
      return this.institutionalEmailRegex.test(value)
        ? null
        : { institutionalEmail: true };
    };
  }

  institutionalEmailNoAdmin(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString().trim();
      if (!value) return null;
      return this.institutionalEmailNoAdminRegex.test(value)
        ? null
        : { institutionalEmailNoAdmin: true };
    };
  }

  minLengthTrim(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString().trim();
      if (!value) return null;
      return value.length >= min ? null : { minLengthTrim: { min } };
    };
  }

  /** Valida que dos campos de un FormGroup coincidan (ej: password y confirmPassword) */
  matchFields(fieldA: string, fieldB: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const a = (group.get(fieldA)?.value ?? '').toString();
      const b = (group.get(fieldB)?.value ?? '').toString();

      if (!a || !b) return null; // required se encarga

      if (a === b) {
        // limpia error en confirm si existe
        const confirm = group.get(fieldB);
        if (confirm?.hasError('fieldsMismatch')) {
          const errors = { ...(confirm.errors || {}) };
          delete errors['fieldsMismatch'];
          confirm.setErrors(Object.keys(errors).length ? errors : null);
        }
        return null;
      }

      // marca error en confirm
      const confirm = group.get(fieldB);
      if (confirm) {
        confirm.setErrors({ ...(confirm.errors || {}), fieldsMismatch: true });
      }

      return { fieldsMismatch: true };
    };
  }
}
