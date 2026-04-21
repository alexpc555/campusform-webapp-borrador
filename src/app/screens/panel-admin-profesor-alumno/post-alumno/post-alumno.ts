import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PostService, Post, CreatePostPayload } from '../../../services/post.services';
import { CategoryService, Category } from '../../../services/category.services';
import { AuthService } from '../../../services/auth.services';

@Component({
  selector: 'app-post-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post-alumno.html',
  styleUrls: ['./post-alumno.scss'],
})
export class PostAlumno implements OnInit {
  modalAbierto = false;
  editando = false;
  editandoId: number | null = null;

  titulo = '';
  categoriaId: number | null = null;
  contenido = '';
  etiquetas = '';

  error = '';
  loading = false;
  cargandoPosts = false;

  posts: Post[] = [];
  categorias: Category[] = [];

  usuarioActual: any;

  constructor(
    private router: Router,
    private postService: PostService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.usuarioActual = this.authService.getCurrentUser();
    this.cargarCategorias();
    this.cargarMisPosts();
  }

  cargarCategorias() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  cargarMisPosts() {
    this.cargandoPosts = true;
    this.postService.getMyPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.cargandoPosts = false;
      },
      error: (err) => {
        console.error('Error cargando posts:', err);
        this.cargandoPosts = false;
      }
    });
  }

  getNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : 'Sin categoría';
  }

  getInitials(nombre: string): string {
    if (!nombre) return '??';
    const words = nombre.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }

  abrirModal() {
    this.editando = false;
    this.editandoId = null;
    this.titulo = '';
    this.categoriaId = null;
    this.contenido = '';
    this.etiquetas = '';
    this.error = '';
    this.modalAbierto = true;
  }

  editarPost(post: Post) {
    this.editando = true;
    this.editandoId = post.id;
    this.titulo = post.titulo;
    this.categoriaId = post.categoria;
    this.contenido = post.contenido;
    this.etiquetas = post.etiquetas || '';
    this.error = '';
    this.modalAbierto = true;
  }

  eliminarPost(post: Post) {
    if (!confirm(`¿Eliminar la publicación "${post.titulo}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.postService.deletePost(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== post.id);
        alert('✅ Publicación eliminada correctamente');
      },
      error: (err) => {
        console.error('Error eliminando post:', err);
        alert('❌ Error al eliminar la publicación');
      }
    });
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.editando = false;
    this.editandoId = null;
    this.error = '';
  }

  publicar() {
    // Validaciones
    if (!this.titulo.trim()) {
      this.error = "El título es obligatorio";
      return;
    }

    if (this.titulo.length > 150) {
      this.error = "El título no puede superar los 150 caracteres";
      return;
    }

    if (!this.categoriaId) {
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
    this.loading = true;

    const payload: CreatePostPayload = {
      titulo: this.titulo.trim(),
      contenido: this.contenido.trim(),
      categoria: this.categoriaId,
      etiquetas: this.etiquetas.trim() || null
    };

    if (this.editando && this.editandoId) {
      // Actualizar post existente
      this.postService.updatePost(this.editandoId, payload).subscribe({
        next: (postActualizado) => {
          this.posts = this.posts.map(p => p.id === postActualizado.id ? postActualizado : p);
          this.loading = false;
          this.cerrarModal();
          alert('✅ Publicación actualizada correctamente');
        },
        error: (err) => {
          console.error('Error actualizando post:', err);
          this.error = err.error?.message || 'Error al actualizar la publicación';
          this.loading = false;
        }
      });
    } else {
      // Crear nuevo post
      this.postService.createPost(payload).subscribe({
        next: (nuevoPost) => {
          this.posts = [nuevoPost, ...this.posts];
          this.loading = false;
          this.cerrarModal();
          alert('✅ Publicación creada correctamente');
        },
        error: (err) => {
          console.error('Error creando post:', err);
          this.error = err.error?.message || 'Error al crear la publicación';
          this.loading = false;
        }
      });
    }
  }

  getEtiquetasArray(etiquetas: string | undefined): string[] {
  if (!etiquetas) return [];
  return etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);}

  volver() {
    this.router.navigate(['/student-panel']);
  }
}