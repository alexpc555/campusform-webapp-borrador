import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-reportes-profesor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes-profesor.html',
  styleUrls: ['./reportes-profesor.scss'],
})
export class ReportesProfesor {

  constructor(private router: Router){}

  volver(){
    this.router.navigate(['/profesor']);
  }

  reportes = [
    {
      titulo: 'Publicaciones realizadas',
      valor: 15,
      descripcion: 'Total de publicaciones creadas'
    },
    {
      titulo: 'Interacciones',
      valor: 120,
      descripcion: 'Comentarios en publicaciones'
    },
    {
      titulo: 'Categoría más activa',
      valor: 'Programación',
      descripcion: 'Categoría con mayor actividad'
    }
  ];

}