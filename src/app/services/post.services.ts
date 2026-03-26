import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.services';

export interface Post {
  id: number;
  titulo: string;
  contenido: string;
  categoria: number;
  categoria_nombre?: string;
  autor: number;
  autor_nombre?: string;
  etiquetas?: string;
  vistas: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface CreatePostPayload {
  titulo: string;
  contenido: string;
  categoria: number;
  etiquetas?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8000/api';

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

  /** Obtener todos los posts (público) */
  getAllPosts(): Observable<Post[]> {
    const url = `${this.apiUrl}/posts/`;
    return this.http.get<Post[]>(url).pipe(
      catchError(error => {
        console.error('Error en getAllPosts:', error);
        return throwError(() => error);
      })
    );
  }

  /** Obtener mis posts (solo los del usuario autenticado) */
  getMyPosts(): Observable<Post[]> {
    const url = `${this.apiUrl}/posts/mis-posts/`;
    return this.http.get<Post[]>(url, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('Error en getMyPosts:', error);
        return throwError(() => error);
      })
    );
  }

  /** Obtener posts por categoría */
  getPostsByCategory(categoriaId: number): Observable<Post[]> {
    const url = `${this.apiUrl}/posts/?categoria=${categoriaId}`;
    return this.http.get<Post[]>(url).pipe(
      catchError(error => {
        console.error('Error en getPostsByCategory:', error);
        return throwError(() => error);
      })
    );
  }

  /** Obtener un post específico */
  getPost(id: number): Observable<Post> {
    const url = `${this.apiUrl}/posts/${id}/`;
    return this.http.get<Post>(url).pipe(
      catchError(error => {
        console.error('Error en getPost:', error);
        return throwError(() => error);
      })
    );
  }

  /** Crear nuevo post */
  createPost(payload: CreatePostPayload): Observable<Post> {
    const url = `${this.apiUrl}/posts/`;
    const token = this.auth.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token de autenticación'));
    }
    return this.http.post<Post>(url, payload, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('Error en createPost:', error);
        return throwError(() => error);
      })
    );
  }

  /** Actualizar post */
  updatePost(id: number, payload: Partial<CreatePostPayload>): Observable<Post> {
    const url = `${this.apiUrl}/posts/${id}/`;
    const token = this.auth.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token de autenticación'));
    }
    return this.http.put<Post>(url, payload, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('Error en updatePost:', error);
        return throwError(() => error);
      })
    );
  }

  /** Eliminar post */
  deletePost(id: number): Observable<void> {
    const url = `${this.apiUrl}/posts/${id}/`;
    const token = this.auth.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token de autenticación'));
    }
    return this.http.delete<void>(url, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('Error en deletePost:', error);
        return throwError(() => error);
      })
    );
  }
}