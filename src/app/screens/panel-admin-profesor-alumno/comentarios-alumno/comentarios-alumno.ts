import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CommentService, Comment } from '../../../services/comment.services';

@Component({
  selector: 'app-comentarios-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './comentarios-alumno.html',
  styleUrls: ['./comentarios-alumno.scss'],
})
export class ComentariosAlumno implements OnInit {
  comments: Comment[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  volver() {
    this.router.navigate(['/student-panel']);
  }

  loadComments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.commentService.getMyComments().subscribe({
      next: (data) => {
        this.comments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando comentarios:', err);
        this.errorMessage = 'No se pudieron cargar tus comentarios.';
        this.loading = false;
      }
    });
  }

  verPostOriginal(postId: number): void {
    this.router.navigate(['/dashboard'], { queryParams: { postId } });
  }
}