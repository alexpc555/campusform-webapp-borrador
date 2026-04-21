import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { PostService, Post } from '../../services/post.services';
import { CategoryService, Category } from '../../services/category.services';
import { AuthService } from '../../services/auth.services';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component';

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './dashboard-screen.html',
  styleUrl: './dashboard-screen.scss',
})
export class DashboardScreen implements OnInit {
  activeSection = 'Inicio';
  activeCategory = 'Todas';
  searchQuery = '';
  sortBy: 'recent' | 'popular' | 'comments' = 'recent';

  posts: Post[] = [];
  filteredPosts: Post[] = [];
  categorias: Category[] = [];
  loading = false;
  userType = '';
  userName = '';

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = window.innerWidth <= 768;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private postService: PostService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadCategorias();
    this.loadPosts();
  }

  loadUserInfo() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userType = this.getUserTypeName(user.role);
      this.userName = user.name;
    }
  }

  getUserTypeName(role: string): string {
    switch(role) {
      case 'student': return 'Estudiante';
      case 'teacher': return 'Profesor';
      case 'admin': return 'Administrador';
      default: return 'Usuario';
    }
  }

  loadCategorias() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  loadPosts() {
    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando posts:', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
  let filtered = [...this.posts];

  // Filtrar por categoría
  if (this.activeCategory !== 'Todas') {
    const categoriaObj = this.categorias.find(c => c.nombre === this.activeCategory);
    if (categoriaObj) {
      filtered = filtered.filter(post => post.categoria === categoriaObj.id);
    }
  }

  // Filtrar por búsqueda
  if (this.searchQuery.trim()) {
    const query = this.searchQuery.toLowerCase();
    filtered = filtered.filter(post =>
      post.titulo.toLowerCase().includes(query) ||
      post.contenido.toLowerCase().includes(query)
    );
  }

  // Ordenar - CORREGIDO
  switch(this.sortBy) {
    case 'recent':
      filtered.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
      break;
    case 'popular':
      // Usar 'vistas' en lugar de 'vote_count'
      filtered.sort((a, b) => (b.vistas || 0) - (a.vistas || 0));
      break;
    case 'comments':
      // Usar 'comentarios_count' o un valor por defecto
      filtered.sort((a, b) => (b.comentarios_count || 0) - (a.comentarios_count || 0));
      break;
  }

  this.filteredPosts = filtered;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  onCategoryChange(category: string) {
    this.activeCategory = category;
    this.applyFilters();
    this.closeIfMobile();
  }

  getCategoriaNombre(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombre : 'Sin categoría';
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
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  openReportModal(post: Post) {
    const dialogRef = this.dialog.open(ReportModalComponent, {
      width: '500px',
      maxWidth: '92vw',
      data: { postId: post.id, postTitle: post.titulo }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Reporte enviado:', result);
      }
    });
  }

  openCommentsModal(post: Post) {
    const dialogRef = this.dialog.open(CommentsModalComponent, {
      width: '600px',
      maxWidth: '92vw',
      maxHeight: '80vh',
      data: { postId: post.id, postTitle: post.titulo }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Comentario agregado');
        this.loadPosts(); // Recargar posts para actualizar contador de comentarios
      }
    });
  }

  goToMyPanel() {
    const user = this.authService.getCurrentUser();
    if (user) {
      switch(user.role) {
        case 'student':
          this.router.navigate(['/student-panel']);
          break;
        case 'teacher':
          this.router.navigate(['/profesor']);
          break;
        case 'admin':
          this.router.navigate(['/admin']);
          break;
        default:
          this.router.navigate(['/']);
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('window:resize')
  onResize() {
    const nowMobile = window.innerWidth <= 768;
    if (nowMobile !== this.isMobile) {
      this.isMobile = nowMobile;
      if (this.sidenav) {
        this.isMobile ? this.sidenav.close() : this.sidenav.open();
      }
    }
  }

  toggleSidenav() {
    if (this.isMobile && this.sidenav) this.sidenav.toggle();
  }

  closeIfMobile() {
    if (this.isMobile && this.sidenav) this.sidenav.close();
  }

  goToCategory(label: string) {
    this.activeCategory = label;
    this.applyFilters();
    this.closeIfMobile();
  }

  goToSection(label: string) {
    this.activeSection = label;
    this.closeIfMobile();

    if (label === 'Inicio') {
      this.loadPosts();
      return;
    }

    // Cargar posts según la sección
    switch(label) {
      case 'Mis Posts':
        this.loadMyPosts();
        break;
      case 'Populares':
        this.loadPopularPosts();
        break;
      case 'Guardados':
        this.loadSavedPosts();
        break;
    }
  }

  loadMyPosts() {
    this.loading = true;
    this.postService.getMyPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando mis posts:', err);
        this.loading = false;
      }
    });
  }

  loadPopularPosts() {
    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data.sort((a, b) => b.vistas - a.vistas);
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando posts populares:', err);
        this.loading = false;
      }
    });
  }

  loadSavedPosts() {
    // Implementar guardados (necesitarás un servicio de favoritos)
    alert('Funcionalidad de guardados en desarrollo');
    this.loading = false;
  }

  getInitials(name: string | undefined): string {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);}

  truncateContent(content: string, maxLength: number): string {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';}

  getTagsArray(etiquetas: string | undefined): string[] {
  if (!etiquetas) return [];
  return etiquetas.split(',').map(t => t.trim()).filter(t => t.length > 0);}
}