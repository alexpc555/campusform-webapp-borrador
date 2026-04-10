import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReportService, Report } from '../../../services/report.services';

@Component({
  selector: 'app-reportes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reportes-admin.html',
  styleUrls: ['./reportes-admin.scss'],
})
export class ReportesAdmin implements OnInit {
  reports: Report[] = [];
  loading = false;
  errorMessage = '';

  statusFilter: 'all' | 'pendiente' | 'revisado' | 'resuelto' = 'pendiente';
  search = '';

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
    this.router.navigate(['/admin']);
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

  get filteredReports(): Report[] {
    const q = this.search.trim().toLowerCase();

    return this.reports.filter(r => {
      const matchesStatus =
        this.statusFilter === 'all' ? true : r.estado === this.statusFilter;

      const matchesText =
        !q ||
        r.post_titulo.toLowerCase().includes(q) ||
        r.motivo.toLowerCase().includes(q) ||
        r.razon.toLowerCase().includes(q) ||
        r.autor_nombre.toLowerCase().includes(q);

      return matchesStatus && matchesText;
    });
  }

  statusLabel(status: Report['estado']): string {
    if (status === 'pendiente') return 'Pendiente';
    if (status === 'revisado') return 'Revisado';
    return 'Resuelto';
  }

  statusClass(status: Report['estado']): string {
    if (status === 'pendiente') return 'badge-pending';
    if (status === 'revisado') return 'badge-review';
    return 'badge-resolved';
  }

  openDetails(report: Report): void {
    this.selected = report;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selected = null;
  }

  marcarRevisado(report: Report): void {
    this.updateEstado(report, 'revisado');
  }

  resolver(report: Report): void {
    this.updateEstado(report, 'resuelto');
  }

  reabrir(report: Report): void {
    this.updateEstado(report, 'pendiente');
  }

  eliminar(report: Report): void {
    if (!confirm(`¿Eliminar el reporte #${report.id}?`)) return;

    this.reportService.deleteReport(report.id).subscribe({
      next: () => {
        this.reports = this.reports.filter(r => r.id !== report.id);

        if (this.selected?.id === report.id) {
          this.closeDetails();
        }
      },
      error: (err) => {
        console.error('Error eliminando reporte:', err);
        alert('No se pudo eliminar el reporte.');
      }
    });
  }

  private updateEstado(report: Report, nuevoEstado: 'pendiente' | 'revisado' | 'resuelto'): void {
    const payload = {
      post: report.post,
      motivo: report.motivo,
      razon: report.razon,
      estado: nuevoEstado
    };

    this.reportService.updateReport(report.id, payload).subscribe({
      next: (updated) => {
        this.reports = this.reports.map(r => r.id === updated.id ? updated : r);

        if (this.selected?.id === updated.id) {
          this.selected = updated;
        }
      },
      error: (err) => {
        console.error('Error actualizando reporte:', err);
        alert('No se pudo actualizar el estado del reporte.');
      }
    });
  }
}