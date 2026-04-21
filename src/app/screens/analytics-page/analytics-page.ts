import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsDashboardResponse } from '../../services/analytics.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Interfaz local para el componente
interface PostPerCategoryItem {
  id: number;
  name: string;
  posts: number;
}

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-page.html',
  styleUrls: ['./analytics-page.scss']
})
export class AnalyticsPageComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);
  private auth = inject(AuthService);
  
  loading = true;
  error = '';
  summaryData: any = null;

  stats: { label: string; value: string; icon: string }[] = [];
  postsPerCategory: PostPerCategoryItem[] = [];
  topUsers: { name: string; posts: number; comments: number; activity: number }[] = [];

  private maxPosts = 0;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    
    this.analyticsService.getDashboard().subscribe({
      next: (data: AnalyticsDashboardResponse) => {
        this.summaryData = data.summary;
        
        this.stats = [
          { label: 'Total Usuarios', value: String(data.summary.total_users), icon: 'bi bi-people' },
          { label: 'Publicaciones', value: String(data.summary.total_posts), icon: 'bi bi-chat-left-text' },
          { label: 'Comentarios', value: String(data.summary.total_comments), icon: 'bi bi-chat-dots' },
          { label: 'Prom. comentarios/post', value: String(data.summary.avg_comments_per_post), icon: 'bi bi-graph-up' }
        ];

        // Mapear los datos agregando un índice como id si no viene del backend
        this.postsPerCategory = (data.posts_per_category || []).map((item, index) => ({
          id: (item as any).id || index + 1,
          name: item.name,
          posts: item.posts
        }));
        
        this.topUsers = data.top_users || [];
        
        // Calcular máximo de posts para las barras
        this.maxPosts = Math.max(...this.postsPerCategory.map(p => p.posts), 1);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando analytics:', err);
        this.error = 'No se pudieron cargar las estadísticas.';
        this.loading = false;
      }
    });
  }

  getStatValue(index: number): string {
    return this.stats[index]?.value || '0';
  }

  getBarHeight(posts: number): number {
    const baseHeight = 20;
    const maxHeight = 200;
    if (this.maxPosts === 0) return baseHeight;
    return Math.max(baseHeight, (posts / this.maxPosts) * maxHeight);
  }

  getBarColor(posts: number): string {
    const colors = ['#1a56db', '#059669', '#ea580c', '#7c3aed', '#dc2626', '#3b82f6'];
    const index = Math.min(posts, colors.length - 1);
    return colors[index % colors.length];
  }

  getCategoryColor(index: number): string {
    const colors = ['#1a56db', '#059669', '#ea580c', '#7c3aed', '#dc2626', '#3b82f6', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  }

  getPercentage(posts: number): number {
    const total = this.postsPerCategory.reduce((sum, p) => sum + p.posts, 0);
    if (total === 0) return 0;
    return Math.round((posts / total) * 100);
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  volver(): void {
    const role = this.auth.getRole();

    if (role === 'admin') {
      this.router.navigate(['/admin']);
      return;
    }

    if (role === 'teacher') {
      this.router.navigate(['/profesor']);
      return;
    }

    if (role === 'student') {
      this.router.navigate(['/student-panel']);
      return;
    }

    this.router.navigate(['/']);
  }

  getTextoVolver(): string {
    const role = this.auth.getRole();
    if (role === 'admin') return 'Volver a Admin';
    if (role === 'teacher') return 'Volver a Profesor';
    if (role === 'student') return 'Volver a Estudiante';
    return 'Volver';
  }

  async downloadPDF(): Promise<void> {
    const element = document.querySelector('.analytics-root') as HTMLElement;
    if (!element) return;

    this.loading = true;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Título del PDF
      pdf.setFontSize(20);
      pdf.setTextColor(30, 66, 159);
      pdf.text('CampusForum - Analytics Dashboard', 10, 20);

      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 10, 30);

      // Agregar la imagen
      pdf.addImage(imgData, 'PNG', 0, 35, pdfWidth, pdfHeight - 10);

      // Guardar
      pdf.save(`CampusForum_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);

      this.loading = false;
    } catch (error) {
      console.error('Error generando PDF:', error);
      this.error = 'Error al generar el PDF. Intenta de nuevo.';
      this.loading = false;
    }
    
  }
}