import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReportService, Report } from '../../../services/report.services';

@Component({
  selector: 'app-reportes-profesor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes-profesor.html',
  styleUrls: ['./reportes-profesor.scss'],
})
export class ReportesProfesor implements OnInit {
  reports: Report[] = [];
  loading = false;
  errorMessage = '';

  showDetails = false;
  selected: Report | null = null;

  constructor(
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  volver(): void {
    this.router.navigate(['/profesor']);
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
        this.errorMessage = 'No se pudieron cargar los reportes.';
        this.loading = false;
      }
    });
  }

  get pendingCount(): number {
    return this.reports.filter(r => r.estado === 'pendiente').length;
  }

  openDetails(report: Report): void {
    this.selected = report;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selected = null;
  }

  getStatusName(estado: string): string {
    const status = estado?.toLowerCase() || '';
    if (status.includes('pendiente')) return 'Pendiente';
    if (status.includes('revisado')) return 'Revisado';
    if (status.includes('resuelto')) return 'Resuelto';
    return 'Pendiente';
  }

  getStatusIcon(estado: string): string {
    const status = estado?.toLowerCase() || '';
    if (status.includes('pendiente')) return 'bi-clock-fill';
    if (status.includes('revisado')) return 'bi-eye-fill';
    if (status.includes('resuelto')) return 'bi-check-circle-fill';
    return 'bi-clock-fill';
  }

  getStatusBadgeClass(estado: string): string {
    const status = estado?.toLowerCase() || '';
    if (status.includes('pendiente')) return 'pendiente';
    if (status.includes('revisado')) return 'revisado';
    if (status.includes('resuelto')) return 'resuelto';
    return 'pendiente';
  }

  getStatusDescription(estado: string): string {
    const status = estado?.toLowerCase() || '';
    if (status.includes('pendiente')) return 'En espera de revisión';
    if (status.includes('revisado')) return 'En proceso de revisión';
    if (status.includes('resuelto')) return 'Reporte resuelto';
    return 'En espera de revisión';
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