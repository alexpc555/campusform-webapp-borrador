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

  constructor(
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  volver() {
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
}