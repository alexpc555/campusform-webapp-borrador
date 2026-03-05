import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Category {
  id: number;
  name: string;
  description: string;
  colorClass: string;
  postCount: number;
}

@Component({
  selector: 'app-categorias-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categorias-administracion.html',
  styleUrls: ['./categorias-administracion.scss'],
})
export class CategoriasAdministracion {
  // demo data
  categories: Category[] = [
    ];

  // form
  newCategory = { name: '', description: '', colorClass: 'dot-blue' };

  // UI
  search = '';
  editingId: number | null = null;
  editForm = { name: '', description: '', colorClass: 'dot-blue' };

  get filteredCategories(): Category[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.categories;
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }

  createCategory() {
    const name = this.newCategory.name.trim();
    const description = this.newCategory.description.trim();

    if (!name || !description) {
      alert('Completa nombre y descripción.');
      return;
    }

    const c: Category = {
      id: Date.now(),
      name,
      description,
      colorClass: this.newCategory.colorClass,
      postCount: 0,
    };

    this.categories = [c, ...this.categories];
    this.newCategory = { name: '', description: '', colorClass: 'dot-blue' };
  }

  startEdit(cat: Category) {
    this.editingId = cat.id;
    this.editForm = {
      name: cat.name,
      description: cat.description,
      colorClass: cat.colorClass,
    };
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit(cat: Category) {
    const name = this.editForm.name.trim();
    const description = this.editForm.description.trim();

    if (!name || !description) {
      alert('Completa nombre y descripción.');
      return;
    }

    this.categories = this.categories.map(c =>
      c.id === cat.id
        ? { ...c, name, description, colorClass: this.editForm.colorClass }
        : c
    );

    this.editingId = null;
  }

  deleteCategory(cat: Category) {
    if (!confirm(`¿Eliminar categoría "${cat.name}"?`)) return;
    this.categories = this.categories.filter(c => c.id !== cat.id);
  }
}