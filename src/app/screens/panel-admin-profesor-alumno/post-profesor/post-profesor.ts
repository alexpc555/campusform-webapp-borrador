import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-post-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post-profesor.html',
  styleUrls: ['./post-profesor.scss'],
})
export class PostProfesor {

  constructor(private router: Router){}

  modalAbierto = false;

  titulo = '';
  categoria = '';
  contenido = '';
  etiquetas = '';

  error = '';

  abrirModal(){
    this.modalAbierto = true;
  }

  cerrarModal(){
    this.modalAbierto = false;
    this.error = '';
  }

  volver(){
    this.router.navigate(['/profesor']);
  }

  publicar(){

    if(!this.titulo.trim()){
      this.error = "El título es obligatorio";
      return;
    }

    if(this.titulo.length > 150){
      this.error = "El título no puede superar los 150 caracteres";
      return;
    }

    if(!this.categoria){
      this.error = "Debe seleccionar una categoría";
      return;
    }

    if(!this.contenido.trim()){
      this.error = "El contenido es obligatorio";
      return;
    }

    if(this.contenido.length > 5000){
      this.error = "El contenido no puede superar los 5000 caracteres";
      return;
    }

    this.error = '';

    alert("Publicación creada correctamente");

    this.titulo='';
    this.categoria='';
    this.contenido='';
    this.etiquetas='';

    this.modalAbierto=false;

  }

}