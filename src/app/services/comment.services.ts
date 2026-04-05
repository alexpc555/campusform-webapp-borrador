import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.services';
import { environment } from '../../environments/environment';

export interface Comment {
  id: number;
  contenido: string;
  post: number;
  autor: number;
  autor_nombre: string;
  fecha_creacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
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

  getCommentsByPost(postId: number): Observable<Comment[]> {
    const url = `${this.apiUrl}/comentarios/?post=${postId}`;
    return this.http.get<Comment[]>(url).pipe(
      catchError(error => {
        console.error('Error en getCommentsByPost:', error);
        return throwError(() => error);
      })
    );
  }

 createComment(payload: { post: number; contenido: string }): Observable<any> {
    const url = `${this.apiUrl}/comentarios/`;
    return this.http.post<Comment>(url, payload, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('Error en createComment:', error);
        return throwError(() => error);
      })
    );
  }

  deleteComment(id: number): Observable<void> {
    const url = `${this.apiUrl}/comentarios/${id}/`;
    return this.http.delete<void>(url, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('Error en deleteComment:', error);
        return throwError(() => error);
      })
    );
  }
}