import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsDashboardResponse } from '../../services/analytics.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services'; // ajusta ruta si es necesario
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

  stats: { label: string; value: string; icon: string }[] = [];
  postsPerCategory: { name: string; posts: number }[] = [];
  topUsers: { name: string; posts: number; comments: number; activity: number }[] = [];

  ngOnInit(): void {
    this.analyticsService.getDashboard().subscribe({
      next: (data: AnalyticsDashboardResponse) => {
        this.stats = [
          { label: 'Total Usuarios', value: String(data.summary.total_users), icon: 'bi bi-people' },
          { label: 'Publicaciones', value: String(data.summary.total_posts), icon: 'bi bi-chat-left-text' },
          { label: 'Comentarios', value: String(data.summary.total_comments), icon: 'bi bi-chat-dots' },
          { label: 'Prom. comentarios/post', value: String(data.summary.avg_comments_per_post), icon: 'bi bi-graph-up' }
        ];

        this.postsPerCategory = data.posts_per_category;
        this.topUsers = data.top_users;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar las estadísticas.';
        this.loading = false;
      }
    });
    
  }
  volver() {
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

  // fallback
  this.router.navigate(['/']);
}
getTextoVolver(): string {
  const role = this.auth.getRole();
  if (role === 'admin') return 'Volver a Admin';
  if (role === 'teacher') return 'Volver a Profesor';
  if (role === 'student') return 'Volver a Estudiante';
  return 'Volver';
}
}