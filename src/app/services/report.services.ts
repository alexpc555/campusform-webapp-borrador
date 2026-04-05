import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.services';
import { environment } from '../../environments/environment';

export interface Report {
  id: number;
  post: number;
  post_titulo: string;
  motivo: string;
  razon: string;
  estado: 'pendiente' | 'revisado' | 'resuelto';
  creado_por: number;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

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

  createReport(payload: { post: number; motivo: string; razon: string }): Observable<any> {
    const url = `${this.apiUrl}/reportes/`;
    return this.http.post<Report>(url, payload, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('Error en createReport:', error);
        return throwError(() => error);
      })
    );
  }

  getReports(): Observable<Report[]> {
    const url = `${this.apiUrl}/reportes/`;
    return this.http.get<Report[]>(url, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('Error en getReports:', error);
        return throwError(() => error);
      })
    );
  }
}