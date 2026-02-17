import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Tab = 'posts' | 'categories' | 'reports';
type ReportStatus = 'pending' | 'resolved' | 'dismissed';
type ReportType = 'post' | 'comment';

interface Category {
  id: number;
  name: string;
  description: string;
  postCount: number;
  colorClass: string; // clase CSS para el puntito
}

interface Report {
  id: number;
  type: ReportType;
  contentTitle: string;
  reporter: string;
  reason: string;
  date: string;
  status: ReportStatus;
}

@Component({
  selector: 'app-profesor-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profesor-screen.html',
  styleUrls: ['./profesor-screen.scss'],
})
export class ProfesorScreen {
  activeTab: Tab = 'categories';

  categories: Category[] = [
    { id: 1, name: 'Matemáticas', description: 'Álgebra, Cálculo, Geometría', postCount: 245, colorClass: 'dot-blue' },
    { id: 2, name: 'Programación', description: 'Lenguajes, Algoritmos, Desarrollo', postCount: 189, colorClass: 'dot-green' },
    { id: 3, name: 'Física', description: 'Mecánica, Termodinámica, Óptica', postCount: 156, colorClass: 'dot-purple' },
    { id: 4, name: 'Campus', description: 'Eventos, Avisos, Horarios', postCount: 98, colorClass: 'dot-yellow' },
    { id: 5, name: 'Tecnología', description: 'IA, Innovación, Tendencias', postCount: 134, colorClass: 'dot-red' },
  ];

  reports: Report[] = [
    { id: 1, type: 'post', contentTitle: 'Spam sobre venta de productos', reporter: 'Juan Pérez', reason: 'Contenido comercial no permitido', date: '2024-02-01', status: 'pending' },
    { id: 2, type: 'comment', contentTitle: 'Lenguaje ofensivo en comentario', reporter: 'María García', reason: 'Uso de lenguaje inapropiado', date: '2024-02-01', status: 'pending' },
    { id: 3, type: 'post', contentTitle: 'Información errónea sobre exámenes', reporter: 'Carlos López', reason: 'Desinformación', date: '2024-01-31', status: 'resolved' },
    { id: 4, type: 'comment', contentTitle: 'Plagio de contenido académico', reporter: 'Ana Martínez', reason: 'Violación de derechos de autor', date: '2024-01-31', status: 'resolved' },
    { id: 5, type: 'post', contentTitle: 'Post duplicado sin motivo', reporter: 'Pedro Sánchez', reason: 'Contenido duplicado', date: '2024-01-30', status: 'dismissed' },
  ];

  // contadores de badges (como en la foto)
  get pendingReportsCount(): number {
    return this.reports.filter(r => r.status === 'pending').length;
  }

  // Acciones demo
  setTab(tab: Tab) {
    this.activeTab = tab;
  }

  newCategory() {
    alert('Aquí abrirías un modal para crear categoría (pendiente).');
  }

  reportAction(id: number, action: 'resolve' | 'dismiss') {
    this.reports = this.reports.map(r =>
      r.id === id
        ? { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' }
        : r
    );
  }

  // helpers UI
  reportTypeLabel(t: ReportType) {
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
}
