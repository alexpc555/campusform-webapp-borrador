import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.services';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'student' | 'teacher' | 'admin';
  fecha_registro: string;
}

export interface CreateUserPayload {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: 'student' | 'teacher' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  /** Helper para headers con token */
  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /** Obtiene todos los usuarios (solo admin) */
  getAllUsers(): Observable<User[]> {
    const url = `${this.apiUrl}/usuarios/`;
    console.log('📡 GET todos los usuarios:', url);

    return this.http.get<any[]>(url, { headers: this.authHeaders() }).pipe(
      map(users => {
        // Transformar los datos según el tipo de usuario
        return users.map(user => ({
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol || this.detectRole(user),
          fecha_registro: user.fecha_registro || new Date().toISOString()
        }));
      }),
      catchError(error => {
        console.error(' Error en getAllUsers:', error);
        return throwError(() => error);
      })
    );
  }

  /** Obtiene un usuario por ID */
  getUser(id: number): Observable<User> {
    const url = `${this.apiUrl}/usuarios/${id}/`;
    console.log('📡 GET usuario:', url);

    return this.http.get<any>(url, { headers: this.authHeaders() }).pipe(
      map(user => ({
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol || this.detectRole(user),
        fecha_registro: user.fecha_registro
      })),
      catchError(error => {
        console.error(' Error en getUser:', error);
        return throwError(() => error);
      })
    );
  }

  /** Crea un nuevo usuario (solo admin) */
  createUser(payload: CreateUserPayload): Observable<User> {
    const url = `${this.apiUrl}/usuarios/`;
    console.log(' POST crear usuario:', url);

    const token = this.auth.getToken();
    if (!token) {
      console.error(' No hay token en localStorage/sessionStorage');
      return throwError(() => new Error('No hay token de autenticación'));
    }

    return this.http.post<any>(url, payload, { headers: this.authHeaders() }).pipe(
      map(user => ({
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol || payload.rol,
        fecha_registro: user.fecha_registro || new Date().toISOString()
      })),
      catchError(error => {
        console.error(' Error en createUser:', error);
        return throwError(() => error);
      })
    );
  }

  /** Actualiza un usuario (solo admin) */
  updateUser(id: number, payload: Partial<CreateUserPayload>): Observable<User> {
    const url = `${this.apiUrl}/usuarios/${id}/`;
    console.log(' PUT actualizar usuario:', url);

    const token = this.auth.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token de autenticación'));
    }

    return this.http.put<any>(url, payload, { headers: this.authHeaders() }).pipe(
      map(user => ({
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol || payload.rol!,
        fecha_registro: user.fecha_registro
      })),
      catchError(error => {
        console.error(' Error en updateUser:', error);
        return throwError(() => error);
      })
    );
  }

  /** Elimina un usuario (solo admin) */
  deleteUser(id: number): Observable<void> {
    const url = `${this.apiUrl}/usuarios/${id}/`;
    console.log('📡 DELETE eliminar usuario:', url);

    const token = this.auth.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token de autenticación'));
    }

    return this.http.delete<void>(url, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error(' Error en deleteUser:', error);
        return throwError(() => error);
      })
    );
  }

  /** Detecta el rol del usuario basado en el modelo */
  private detectRole(user: any): 'student' | 'teacher' | 'admin' {
    if (user.hasOwnProperty('matricula')) return 'student';
    if (user.hasOwnProperty('departamento')) return 'teacher';
    return 'admin';
  }
}