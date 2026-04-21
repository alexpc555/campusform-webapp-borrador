import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { PostService, Post } from '../../services/post.services';
import { CategoryService, Category } from '../../services/category.services';

@Component({
  selector: 'app-landig-page',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
  ],
  templateUrl: './landig-page.html',
  styleUrl: './landig-page.scss',
})
export class LandigPage implements OnInit {
  recentPosts: Post[] = [];
  categorias: Category[] = [];
  loading: boolean = false;

  constructor(
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadRecentPosts();
  }

  loadCategorias(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categorias = data;
      },
      error: (err: any) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  loadRecentPosts(): void {
    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: (data: Post[]) => {
        // Ordenar por fecha más reciente y tomar solo los primeros 2
        this.recentPosts = data
          .sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
          .slice(0, 2);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando posts recientes:', err);
        this.loading = false;
        this.recentPosts = [];
      }
    });
  }

  getCategoriaNombre(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : 'General';
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

  getAutorIniciales(nombre: string): string {
    if (!nombre) return 'UN';
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  truncateText(text: string, maxLength: number = 60): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Método auxiliar para procesar etiquetas en el template
  getEtiquetasArray(etiquetas: string | undefined): string[] {
    if (!etiquetas) return [];
    return etiquetas.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
}