import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-categorias-profesor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categorias-profesor.html',
  styleUrls: ['./categorias-profesor.scss']
})
export class CategoriasProfesor {

  constructor(private router: Router){}

  volver(){
    this.router.navigate(['/profesor']);
  }

  irFisica(){
    this.router.navigate(['/dashboard/categoria/fisica']);
  }

  irIngles(){
    this.router.navigate(['/dashboard/categoria/ingles']);
  }

  irMatematicas(){
    this.router.navigate(['/dashboard/categoria/matematicas']);
  }

  irProgramacion(){
    this.router.navigate(['/dashboard/categoria/programacion']);
  }

}