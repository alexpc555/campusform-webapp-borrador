import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type UserRole = 'student' | 'professor' | 'admin';
type UserStatus = 'active' | 'suspended';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

@Component({
  selector: 'app-gestion-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestion-usuario.html',
  styleUrls: ['./gestion-usuario.scss'],
})
export class GestionUsuario {
  users: User[] = [
   /* { id: 1, name: 'Juan Pérez', email: 'juan@buap.mx', role: 'student', status: 'active', createdAt: '2026-02-10' },
    { id: 2, name: 'María García', email: 'maria@buap.mx', role: 'student', status: 'active', createdAt: '2026-02-11' },
    { id: 3, name: 'Dr. Roberto Sánchez', email: 'roberto@buap.mx', role: 'professor', status: 'active', createdAt: '2026-02-01' },
    { id: 4, name: 'Admin Demo', email: 'admin@buap.mx', role: 'admin', status: 'active', createdAt: '2026-01-15' },
    { id: 5, name: 'Pedro Sánchez', email: 'pedro@buap.mx', role: 'student', status: 'suspended', createdAt: '2026-02-12' },
 */ ];

  // filtros
  search = '';
  roleFilter: UserRole | 'all' = 'all';
  statusFilter: UserStatus | 'all' = 'all';

  // crear usuario (mock)
  newUser = { name: '', email: '', role: 'student' as UserRole };

  get filteredUsers(): User[] {
    const q = this.search.trim().toLowerCase();

    return this.users.filter(u => {
      const matchesText =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);

      const matchesRole = this.roleFilter === 'all' ? true : u.role === this.roleFilter;
      const matchesStatus = this.statusFilter === 'all' ? true : u.status === this.statusFilter;

      return matchesText && matchesRole && matchesStatus;
    });
  }

  createUser() {
    const name = this.newUser.name.trim();
    const email = this.newUser.email.trim().toLowerCase();

    if (!name || !email) {
      alert('Completa nombre y email.');
      return;
    }

    const emailExists = this.users.some(u => u.email.toLowerCase() === email);
    if (emailExists) {
      alert('Ese email ya existe.');
      return;
    }

    const u: User = {
      id: Date.now(),
      name,
      email,
      role: this.newUser.role,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    this.users = [u, ...this.users];
    this.newUser = { name: '', email: '', role: 'student' };
  }

  setRole(user: User, role: UserRole) {
    this.users = this.users.map(u => (u.id === user.id ? { ...u, role } : u));
  }

  toggleSuspend(user: User) {
    this.users = this.users.map(u =>
      u.id === user.id
        ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
        : u
    );
  }

  deleteUser(user: User) {
    if (!confirm(`¿Eliminar usuario "${user.name}"?`)) return;
    this.users = this.users.filter(u => u.id !== user.id);
  }

  statusClass(status: UserStatus) {
    // reusamos las clases tipo badge-* que ya hicimos
    return status === 'active' ? 'badge-resolved' : 'badge-pending';
  }
}