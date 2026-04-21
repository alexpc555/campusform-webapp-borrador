import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService, User, CreateUserPayload } from '../../../services/user.services';
import { SHARED_IMPORTS } from '../../../shared/shared.imports';

// Declarar bootstrap global
declare var bootstrap: any;

@Component({
  selector: 'app-gestion-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ...SHARED_IMPORTS],
  templateUrl: './gestion-usuario.html',
  styleUrls: ['./gestion-usuario.scss'],
})
export class GestionUsuario implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';
  saving = false;

  search = '';
  roleFilter: string = 'all';

  formUser: any = {
    nombre: '',
    correo: '',
    contrasena: '',
    confirmPassword: '',
    rol: 'student'
  };
  
  editingUser: User | null = null;
  modalTitle = 'Crear Usuario';
  private modalInstance: any = null;

  domainMap = {
    student: '@alumno.buap.mx',
    teacher: '@buap.mx',
    admin: '@admin.buap.mx'
  };

  roleNames = {
    student: 'estudiante',
    teacher: 'profesor',
    admin: 'administrador'
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  get filteredUsers(): User[] {
    const q = this.search.trim().toLowerCase();
    
    return this.users.filter(u => {
      const matchesText = !q || 
        u.nombre.toLowerCase().includes(q) || 
        u.correo.toLowerCase().includes(q);
      
      const matchesRole = this.roleFilter === 'all' ? true : u.rol === this.roleFilter;
      
      return matchesText && matchesRole;
    });
  }

  get passwordsMismatch(): boolean {
    if (!this.editingUser && this.formUser.contrasena && this.formUser.confirmPassword) {
      return this.formUser.contrasena !== this.formUser.confirmPassword;
    }
    return false;
  }

  getEmailPlaceholder(): string {
    const roleValue = this.formUser.rol;
    if (roleValue && this.domainMap[roleValue as keyof typeof this.domainMap]) {
      return `ejemplo${this.domainMap[roleValue as keyof typeof this.domainMap]}`;
    }
    return 'correo@dominio.com';
  }

  getEmailErrorMessage(): string {
    const email = this.formUser.correo;
    const roleValue = this.formUser.rol;

    if (email && roleValue) {
      let isValid = false;
      let expectedDomain = '';

      switch (roleValue) {
        case 'student':
          isValid = /^[^\s@]+@alumno\.buap\.mx$/i.test(email);
          expectedDomain = this.domainMap.student;
          break;
        case 'teacher':
          isValid = /^[^\s@]+@buap\.mx$/i.test(email);
          expectedDomain = this.domainMap.teacher;
          break;
        case 'admin':
          isValid = /^[^\s@]+@admin\.buap\.mx$/i.test(email);
          expectedDomain = this.domainMap.admin;
          break;
      }

      if (!isValid && email) {
        const roleName = this.roleNames[roleValue as keyof typeof this.roleNames];
        return `Los ${roleName}s deben usar correo ${expectedDomain}`;
      }
    }
    return '';
  }

  onRoleChange() {
    this.formUser.correo = '';
  }

  loadUsers() {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.errorMessage = 'Error al cargar los usuarios. Intenta de nuevo.';
        this.loading = false;
        
        if (err.status === 401) {
          this.errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        }
      }
    });
  }

  openCreateModal() {
    this.editingUser = null;
    this.modalTitle = 'Crear Usuario';
    this.formUser = {
      nombre: '',
      correo: '',
      contrasena: '',
      confirmPassword: '',
      rol: 'student'
    };
    this.showModal();
  }

  editUser(user: User) {
    this.editingUser = user;
    this.modalTitle = 'Editar Usuario';
    this.formUser = {
      nombre: user.nombre,
      correo: user.correo,
      contrasena: '',
      confirmPassword: '',
      rol: user.rol
    };
    this.showModal();
  }

  validateEmail(): boolean {
    const email = this.formUser.correo?.trim();
    const role = this.formUser.rol;

    if (!email) return false;

    switch (role) {
      case 'student':
        return /^[^\s@]+@alumno\.buap\.mx$/i.test(email);
      case 'teacher':
        return /^[^\s@]+@buap\.mx$/i.test(email);
      case 'admin':
        return /^[^\s@]+@admin\.buap\.mx$/i.test(email);
      default:
        return false;
    }
  }

  validateName(): boolean {
    const name = this.formUser.nombre?.trim();
    if (!name) return false;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return nameRegex.test(name);
  }

  validatePassword(): boolean {
    const password = this.formUser.contrasena;
    if (!this.editingUser && !password) return false;
    if (password && password.length > 0) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      return passwordRegex.test(password);
    }
    return true;
  }

  saveUser() {
    if (!this.formUser.nombre?.trim()) {
      alert('El nombre es requerido.');
      return;
    }

    if (!this.validateName()) {
      alert('El nombre solo puede contener letras y espacios.');
      return;
    }

    if (!this.formUser.correo?.trim()) {
      alert('El correo es requerido.');
      return;
    }

    if (!this.validateEmail()) {
      alert(this.getEmailErrorMessage());
      return;
    }

    if (!this.editingUser) {
      if (!this.formUser.contrasena) {
        alert('La contraseña es requerida.');
        return;
      }
      
      if (!this.validatePassword()) {
        alert('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
        return;
      }

      if (this.formUser.contrasena !== this.formUser.confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }
    } else {
      if (this.formUser.contrasena && !this.validatePassword()) {
        alert('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
        return;
      }
    }

    this.saving = true;

    if (this.editingUser) {
      const updatePayload: any = {
        nombre: this.formUser.nombre.trim(),
        correo: this.formUser.correo.trim().toLowerCase(),
        rol: this.formUser.rol
      };
      
      if (this.formUser.contrasena && this.formUser.contrasena.trim()) {
        updatePayload.contrasena = this.formUser.contrasena;
      }
      
      this.userService.updateUser(this.editingUser.id, updatePayload).subscribe({
        next: (updatedUser) => {
          this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
          this.hideModal();
          this.saving = false;
        },
        error: (err) => {
          console.error('Error actualizando usuario:', err);
          this.errorMessage = err.error?.message || 'Error al actualizar el usuario.';
          this.saving = false;
        }
      });
    } else {
      const createPayload: CreateUserPayload = {
        nombre: this.formUser.nombre.trim(),
        correo: this.formUser.correo.trim().toLowerCase(),
        contrasena: this.formUser.contrasena,
        rol: this.formUser.rol
      };
      
      this.userService.createUser(createPayload).subscribe({
        next: (newUser) => {
          this.users = [newUser, ...this.users];
          this.hideModal();
          this.saving = false;
        },
        error: (err) => {
          console.error('Error creando usuario:', err);
          this.errorMessage = err.error?.message || 'Error al crear el usuario.';
          this.saving = false;
        }
      });
    }
  }

  deleteUser(user: User) {
    if (!confirm(`¿Eliminar usuario "${user.nombre}"? Esta acción no se puede deshacer.`)) return;
    
    this.loading = true;
    this.errorMessage = '';

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error eliminando usuario:', err);
        this.errorMessage = 'Error al eliminar el usuario. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  getRoleName(role: string): string {
    switch(role) {
      case 'student': return 'Estudiante';
      case 'teacher': return 'Profesor';
      case 'admin': return 'Administrador';
      default: return role;
    }
  }

  getRoleIcon(role: string): string {
    switch(role) {
      case 'student': return 'bi-mortarboard';
      case 'teacher': return 'bi-chalkboard';
      case 'admin': return 'bi-shield-lock';
      default: return 'bi-person';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch(role) {
      case 'student': return 'student';
      case 'teacher': return 'teacher';
      case 'admin': return 'admin';
      default: return 'student';
    }
  }

  getRoleAvatarClass(role: string): string {
    switch(role) {
      case 'student': return 'student';
      case 'teacher': return 'teacher';
      case 'admin': return 'admin';
      default: return 'student';
    }
  }

  private showModal() {
    const modalElement = document.getElementById('userModal');
    if (modalElement) {
      // Limpiar backdrops existentes
      this.cleanupBackdrops();
      
      // Crear nueva instancia del modal
      this.modalInstance = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: true
      });
      
      this.modalInstance.show();
    }
  }

  private hideModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null;
    }
    this.cleanupBackdrops();
  }

  private cleanupBackdrops() {
    // Eliminar backdrops residuales
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // Restaurar el body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}