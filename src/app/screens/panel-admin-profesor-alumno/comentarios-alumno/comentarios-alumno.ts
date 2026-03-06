import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Comment } from '../../student-panel/student-panel';

@Component({
  selector: 'app-comentarios-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './comentarios-alumno.html',
  styleUrls: ['./comentarios-alumno.scss'],
})
export class ComentariosAlumno {

  constructor(private router: Router) { }

  volver() {
    this.router.navigate(['/student-panel']);
  }

  comments: Comment[] = [
    {
      id: 1,
      postTitle: 'Pregunta sobre Cálculo Diferencial - Límites',
      content: 'Puedes usar la regla de L\'Hôpital cuando tienes formas indeterminadas como 0/0 o ∞/∞',
      date: '2023-10-25',
      timeAgo: 'Hace 1 hora'
    },
    {
      id: 2,
      postTitle: 'Horarios de Biblioteca para exámenes finales',
      content: 'Gracias por la información! Muy útil para planear mis sesiones de estudio.',
      date: '2023-10-24',
      timeAgo: 'Hace 2 días'
    }
  ];

}
