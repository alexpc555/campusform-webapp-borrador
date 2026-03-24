import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

export interface Publication {
  id: number;
  title: string;
  body: string;
  date: string;
}

export interface Comment {
  id: number;
  postTitle: string;
  content: string;
  date: string;
  timeAgo: string;
}

export interface Report {
  id: number;
  type: string;
  title: string;
  reason: string;
  description: string;
  date: string;
  timeAgo: string;
  status: string;
}

@Component({
  selector: 'app-student-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-panel.html',
  styleUrl: './student-panel.scss'
})
export class StudentPanelComponent {

  constructor(private router: Router) {}

  irPosts() {
    this.router.navigate(['/student-panel/post']);
  }

  irComentarios() {
    this.router.navigate(['/student-panel/comentarios']);
  }

  irReportes() {
    this.router.navigate(['/student-panel/reportes']);
  }

  salir() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}