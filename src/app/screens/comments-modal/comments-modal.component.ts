import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommentService, Comment } from '../../services/comment.services';
import { AuthService } from '../../services/auth.services';

export interface CommentsData {
  postId: number;
  postTitle: string;
}

@Component({
  selector: 'app-comments-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.scss']
})
export class CommentsModalComponent implements OnInit {
  comments: Comment[] = [];
  nuevoComentario = '';
  loadingComments = false;
  submittingComment = false;
  isLoggedIn = false;
  currentUser: any;

  constructor(
    public dialogRef: MatDialogRef<CommentsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommentsData,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    this.loadComments();
  }

  loadComments() {
    this.loadingComments = true;
    this.commentService.getCommentsByPost(this.data.postId).subscribe({
      next: (data) => {
        this.comments = data;
        this.loadingComments = false;
      },
      error: (err) => {
        console.error('Error cargando comentarios:', err);
        this.loadingComments = false;
      }
    });
  }

  isFormValid(): boolean {
    return this.nuevoComentario.trim().length >= 3 && this.nuevoComentario.length <= 1000;
  }

  canDeleteComment(comment: Comment): boolean {
    if (!this.currentUser) return false;
    return comment.autor === this.currentUser.id || this.currentUser.role === 'admin';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Justo ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }

  submitComment() {
    if (!this.isFormValid()) return;

    this.submittingComment = true;

    const commentData = {
      post: this.data.postId,
      contenido: this.nuevoComentario.trim()
    };

    this.commentService.createComment(commentData).subscribe({
      next: (newComment) => {
        this.comments.unshift(newComment);
        this.nuevoComentario = '';
        this.submittingComment = false;
      },
      error: (err) => {
        console.error('Error al publicar comentario:', err);
        this.submittingComment = false;
        alert('Error al publicar el comentario. Intenta de nuevo.');
      }
    });
  }

  deleteComment(commentId: number) {
    if (!confirm('¿Eliminar este comentario?')) return;

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== commentId);
      },
      error: (err) => {
        console.error('Error al eliminar comentario:', err);
        alert('Error al eliminar el comentario.');
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}