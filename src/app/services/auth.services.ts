import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: 'student' | 'teacher' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  refresh: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
  };
  redirect: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(payload: RegisterPayload): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    console.log('📤 Enviando registro a:', `${this.apiUrl}/auth/register/`);
    console.log('📦 Payload:', payload);
    
    return this.http.post(`${this.apiUrl}/auth/register/`, payload, { headers });
  }

  login(credentials: LoginPayload): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/`, credentials, { headers }).pipe(
      tap((response: AuthResponse) => {
        if (response.user && response.token) {
          // Guardar token y datos del usuario
          localStorage.setItem('token', response.token);
          localStorage.setItem('refresh', response.refresh);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          console.log('✅ Usuario autenticado:', response.user);
          console.log('📌 Rol:', response.user.role);
          
          // Redirigir según el rol
          const redirectMap: { [key: string]: string } = {
            'student': '/student-panel',
            'teacher': '/profesor',
            'admin': '/admin'
          };
          
          const redirectPath = redirectMap[response.user.role];
          console.log('🔄 Redirigiendo a:', redirectPath);
          this.router.navigate([redirectPath]);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  hasRole(role: 'student' | 'teacher' | 'admin'): boolean {
    const userRole = this.getRole();
    return userRole === role;
  }

  refreshToken(): Observable<any> {
    const refresh = localStorage.getItem('refresh');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    return this.http.post(`${this.apiUrl}/auth/refresh/`, { refresh }, { headers }).pipe(
      tap((response: any) => {
        if (response.access) {
          localStorage.setItem('token', response.access);
        }
      })
    );
  }
}