import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type ReportStatus = 'pending' | 'resolved' | 'dismissed';
type ReportType = 'post' | 'comment';
type Severity = 'low' | 'medium' | 'high';

interface Report {
  id: number;
  type: ReportType;
  contentTitle: string;
  reporter: string;
  reportedUser: string;
  reason: string;
  description: string;
  date: string;
  status: ReportStatus;
  severity: Severity;
}

@Component({
  selector: 'app-reportes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reportes-admin.html',
  styleUrls: ['./reportes-admin.scss'],
})
export class ReportesAdmin {
  // demo data
  reports: Report[] = [/*
    {
      id: 1,
      type: 'post',
      contentTitle: 'Spam sobre venta de productos',
      reporter: 'Juan Pérez',
      reportedUser: 'Pedro Sánchez',
      reason: 'Contenido comercial no permitido',
      description: 'Publicó links de venta repetidas veces en varias categorías.',
      date: '2024-02-01',
      status: 'pending',
      severity: 'high',
    },
    {
      id: 2,
      type: 'comment',
      contentTitle: 'Lenguaje ofensivo en comentario',
      reporter: 'María García',
      reportedUser: 'Juan Pérez',
      reason: 'Uso de lenguaje inapropiado',
      description: 'Insultos directos a otro usuario en hilo de Matemáticas.',
      date: '2024-02-01',
      status: 'pending',
      severity: 'medium',
    },
    {
      id: 3,
      type: 'post',
      contentTitle: 'Información errónea sobre exámenes',
      reporter: 'Carlos López',
      reportedUser: 'Ana Martínez',
      reason: 'Desinformación',
      description: 'Publicación con fechas falsas; ya se corrigió en comentarios.',
      date: '2024-01-31',
      status: 'resolved',
      severity: 'low',
    },
    {
      id: 4,
      type: 'comment',
      contentTitle: 'Plagio de contenido académico',
      reporter: 'Ana Martínez',
      reportedUser: 'María García',
      reason: 'Violación de derechos de autor',
      description: 'Copió texto completo de un libro sin citar.',
      date: '2024-01-31',
      status: 'dismissed',
      severity: 'high',
    },
  */];

  // filters
  statusFilter: 'all' | ReportStatus = 'pending';
  typeFilter: 'all' | ReportType = 'all';
  search = '';

  // modal
  showDetails = false;
  selected: Report | null = null;

  get pendingCount(): number {
    return this.reports.filter(r => r.status === 'pending').length;
  }

  get filteredReports(): Report[] {
    const q = this.search.trim().toLowerCase();

    return this.reports.filter(r => {
      const matchesStatus = this.statusFilter === 'all' ? true : r.status === this.statusFilter;
      const matchesType = this.typeFilter === 'all' ? true : r.type === this.typeFilter;

      const matchesText =
        !q ||
        r.contentTitle.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.reporter.toLowerCase().includes(q) ||
        r.reportedUser.toLowerCase().includes(q);

      return matchesStatus && matchesType && matchesText;
    });
  }

  // UI helpers
  typeLabel(t: ReportType) {
    return t === 'post' ? 'Publicación' : 'Comentario';
  }

  statusLabel(s: ReportStatus) {
    if (s === 'pending') return 'Pendiente';
    if (s === 'resolved') return 'Resuelto';
    return 'Desestimado';
  }

  statusClass(s: ReportStatus) {
    if (s === 'pending') return 'badge-pending';
    if (s === 'resolved') return 'badge-resolved';
    return 'badge-dismissed';
  }

  severityLabel(sev: Severity) {
    if (sev === 'low') return 'Baja';
    if (sev === 'medium') return 'Media';
    return 'Alta';
  }

  severityClass(sev: Severity) {
    if (sev === 'low') return 'sev-low';
    if (sev === 'medium') return 'sev-medium';
    return 'sev-high';
  }

  // actions
  resolve(r: Report) {
    this.reports = this.reports.map(x => (x.id === r.id ? { ...x, status: 'resolved' } : x));
    if (this.selected?.id === r.id) this.selected = { ...r, status: 'resolved' };
  }

  dismiss(r: Report) {
    this.reports = this.reports.map(x => (x.id === r.id ? { ...x, status: 'dismissed' } : x));
    if (this.selected?.id === r.id) this.selected = { ...r, status: 'dismissed' };
  }

  reopen(r: Report) {
    this.reports = this.reports.map(x => (x.id === r.id ? { ...x, status: 'pending' } : x));
    if (this.selected?.id === r.id) this.selected = { ...r, status: 'pending' };
  }

  openDetails(r: Report) {
    this.selected = r;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selected = null;
  }
}