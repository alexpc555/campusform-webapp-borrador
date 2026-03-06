import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Publication } from '../../student-panel/student-panel';

@Component({
  selector: 'app-post-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post-alumno.html',
  styleUrls: ['./post-alumno.scss'],
})
export class PostAlumno {

  constructor(private router: Router) { }

  modalAbierto = false;

  titulo = '';
  categoria = '';
  contenido = '';
  etiquetas = '';

  error = '';

  posts: Publication[] = [];

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.error = '';
  }

  volver() {
    this.router.navigate(['/student-panel']);
  }

  publicar() {

    if (!this.titulo.trim()) {
      this.error = "El título es obligatorio";
      return;
    }

    if (this.titulo.length > 150) {
      this.error = "El título no puede superar los 150 caracteres";
      return;
    }

    if (!this.categoria) {
      this.error = "Debe seleccionar una categoría";
      return;
    }

    if (!this.contenido.trim()) {
      this.error = "El contenido es obligatorio";
      return;
    }

    if (this.contenido.length > 5000) {
      this.error = "El contenido no puede superar los 5000 caracteres";
      return;
    }

    this.error = '';

    const now = new Date();
    const post: Publication = {
      id: this.posts.length + 1,
      title: this.titulo,
      body: this.contenido,
      date: now.toISOString().split('T')[0]
    };

    this.posts.unshift(post);

    alert("Publicación creada correctamente");

    this.titulo = '';
    this.categoria = '';
    this.contenido = '';
    this.etiquetas = '';

    this.modalAbierto = false;

  }

}
