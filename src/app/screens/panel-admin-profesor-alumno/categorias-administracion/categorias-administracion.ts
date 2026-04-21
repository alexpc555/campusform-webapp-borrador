import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService, Category, CreateCategoryPayload } from '../../../services/category.services';
import { AuthService } from '../../../services/auth.services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-categorias-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categorias-administracion.html',
  styleUrls: ['./categorias-administracion.scss'],
})
export class CategoriasAdministracion implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  categories: Category[] = [];
  loading = false;
  errorMessage = '';

  // Formulario nueva categoría
  newCategory: CreateCategoryPayload = { nombre: '', descripcion: '' };

  // UI
  search = '';
  editingId: number | null = null;
  editForm: CreateCategoryPayload = { nombre: '', descripcion: '' };

  constructor(
    private categoryService: CategoryService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get filteredCategories(): Category[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.categories;
    
    return this.categories.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.descripcion.toLowerCase().includes(q)
    );
  }

  // Funciones de permisos
  canEditCategory(category: Category): boolean {
    const user = this.auth.getCurrentUser();
    if (!user) return false;

    if (user.role === 'admin') return true;
    if (user.role === 'teacher') {
      return category.creador_tipo === 'teacher';
    }
    return false;
  }

  canDeleteCategory(category: Category): boolean {
    const user = this.auth.getCurrentUser();
    if (!user) return false;
    return user.role === 'admin';
  }

  // Carga todas las categorías desde el backend
  loadCategories() {
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando categorías:', err);
          this.errorMessage = 'Error al cargar las categorías. Intenta de nuevo.';
          this.loading = false;
          
          if (err.status === 401) {
            this.errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
          }
        }
      });
  }

  createCategory() {
    const nombre = this.newCategory.nombre?.trim();
    const descripcion = this.newCategory.descripcion?.trim();

    if (!nombre || !descripcion) {
      alert('Completa nombre y descripción.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.categoryService.createCategory({ nombre, descripcion })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newCat) => {
          this.categories = [newCat, ...this.categories];
          this.newCategory = { nombre: '', descripcion: '' };
          this.loading = false;
        },
        error: (err) => {
          console.error('Error creando categoría:', err);
          this.errorMessage = err.error?.message || 'Error al crear la categoría. Intenta de nuevo.';
          this.loading = false;
        }
      });
  }

  startEdit(cat: Category) {
    // Evitar múltiples ediciones simultáneas
    if (this.editingId !== null) {
      this.cancelEdit();
    }
    
    this.editingId = cat.id;
    this.editForm = {
      nombre: cat.nombre,
      descripcion: cat.descripcion,
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.editForm = { nombre: '', descripcion: '' };
  }

  saveEdit(cat: Category) {
    const nombre = this.editForm.nombre?.trim();
    const descripcion = this.editForm.descripcion?.trim();

    if (!nombre || !descripcion) {
      alert('Completa nombre y descripción.');
      return;
    }

    // Verificar si realmente hubo cambios
    if (nombre === cat.nombre && descripcion === cat.descripcion) {
      this.cancelEdit();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.categoryService.updateCategory(cat.id, { nombre, descripcion })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedCat) => {
          this.categories = this.categories.map(c =>
            c.id === cat.id ? updatedCat : c
          );
          this.cancelEdit();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error actualizando categoría:', err);
          this.errorMessage = err.error?.message || 'Error al actualizar la categoría. Intenta de nuevo.';
          this.loading = false;
        }
      });
  }

  deleteCategory(cat: Category) {
    if (!confirm(`¿Eliminar categoría "${cat.nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
    
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.deleteCategory(cat.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== cat.id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error eliminando categoría:', err);
          this.errorMessage = err.error?.message || 'Error al eliminar la categoría. Intenta de nuevo.';
          this.loading = false;
        }
      });
  }

  getCategoryColorClass(id: number): string {
  const colors = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4'];
  return colors[id % colors.length]; }
}