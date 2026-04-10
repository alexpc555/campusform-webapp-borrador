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
}