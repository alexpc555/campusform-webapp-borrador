import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReportService, Report } from '../../../services/report.services';

@Component({
  selector: 'app-reportes-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes-alumno.html',
  styleUrls: ['./reportes-alumno.scss'],
})
export class ReportesAlumno implements OnInit {
  reports: Report[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  volver() {
    this.router.navigate(['/student-panel']);
  }

  loadReports(): void {
    this.loading = true;
    this.errorMessage = '';

    this.reportService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando reportes:', err);
        this.errorMessage = 'No se pudieron cargar tus reportes.';
        this.loading = false;
      }
    });
  }

  getStatusClass(estado: string): string {
    const status = estado?.toLowerCase() || '';
    if (status.includes('pendiente')) return 'pendiente';
    if (status.includes('revisado')) return 'revisado';
    if (status.includes('resuelto')) return 'resuelto';
    if (status.includes('rechazado')) return 'rechazado';
    return 'pendiente';
  }

  getStatusBadgeClass(estado: string): string {
    return this.getStatusClass(estado);
  }

  getStatusIcon(estado: string): string {
    const status = estado?.toLowerCase() || '';
    if (status.includes('pendiente')) return 'bi-clock-fill';
    if (status.includes('revisado')) return 'bi-eye-fill';
    if (status.includes('resuelto')) return 'bi-check-circle-fill';
    if (status.includes('rechazado')) return 'bi-x-circle-fill';
    return 'bi-clock-fill';
  }

  getStatusName(estado: string): string {
    const status = estado?.toLowerCase() || '';
    if (status.includes('pendiente')) return 'Pendiente';
    if (status.includes('revisado')) return 'Revisado';
    if (status.includes('resuelto')) return 'Resuelto';
    if (status.includes('rechazado')) return 'Rechazado';
    return estado || 'Pendiente';
  }

  getStatusDescription(estado: string): string {
    const status = estado?.toLowerCase() || '';
    if (status.includes('pendiente')) return 'En espera de revisión';
    if (status.includes('revisado')) return 'En proceso de revisión';
    if (status.includes('resuelto')) return 'Reporte resuelto';
    if (status.includes('rechazado')) return 'Reporte rechazado';
    return 'Estado desconocido';
  }

  getMotivoName(motivo: string): string {
    const motivos: { [key: string]: string } = {
      'spam': 'Spam o contenido engañoso',
      'contenido_inapropiado': 'Contenido inapropiado',
      'acoso': 'Acoso o intimidación',
      'lenguaje_ofensivo': 'Lenguaje ofensivo',
      'informacion_falsa': 'Información falsa',
      'derechos_autor': 'Violación de derechos de autor',
      'otro': 'Otro'
    };
    return motivos[motivo] || motivo;
  }
}