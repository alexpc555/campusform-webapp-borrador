import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Report } from '../../student-panel/student-panel';

@Component({
  selector: 'app-reportes-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reportes-alumno.html',
  styleUrls: ['./reportes-alumno.scss'],
})
export class ReportesAlumno {

  constructor(private router: Router) { }

  modalAbierto = false;

  tipoContenido = '';
  tituloContenido = '';
  razon = '';
  descripcion = '';

  error = '';

  reports: Report[] = [
    {
      id: 1,
      type: 'Publicación',
      status: 'Pendiente',
      title: 'Contenido spam inapropiado',
      reason: 'Spam o publicidad',
      description: 'Este post contiene publicidad no relacionada con temas académicos',
      date: '2023-10-25',
      timeAgo: 'Hace 1 día'
    }
  ];

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.error = '';
  }

  volver() {
    this.router.navigate(['/student-panel']);
  }

  enviarReporte() {

    if (!this.tipoContenido) {
      this.error = "Debe seleccionar un tipo de contenido";
      return;
    }

    if (!this.tituloContenido.trim()) {
      this.error = "El título del contenido es obligatorio";
      return;
    }

    if (this.tituloContenido.length > 150) {
      this.error = "El título no puede superar los 150 caracteres";
      return;
    }

    if (!this.razon) {
      this.error = "Debe seleccionar una razón para el reporte";
      return;
    }

    if (!this.descripcion.trim()) {
      this.error = "La descripción es obligatoria";
      return;
    }

    if (this.descripcion.length > 5000) {
      this.error = "La descripción no puede superar los 5000 caracteres";
      return;
    }

    this.error = '';

    const now = new Date();
    const reporte: Report = {
      id: this.reports.length + 1,
      type: this.tipoContenido,
      status: 'Pendiente',
      title: this.tituloContenido,
      reason: this.razon,
      description: this.descripcion,
      date: now.toISOString().split('T')[0],
      timeAgo: 'Ahora'
    };

    this.reports.unshift(reporte);

    alert("Reporte enviado correctamente");

    this.tipoContenido = '';
    this.tituloContenido = '';
    this.razon = '';
    this.descripcion = '';

    this.modalAbierto = false;

  }

}
