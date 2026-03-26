import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ReportService } from '../../services/report.services';
import { AuthService } from '../../services/auth.services';

export interface ReportData {
  postId: number;
  postTitle: string;
}

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss']
})
export class ReportModalComponent {
  motivo = '';
  razon = '';
  submitting = false;
  isLoggedIn = false;

  constructor(
    public dialogRef: MatDialogRef<ReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportData,
    private reportService: ReportService,
    private authService: AuthService
  ) {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  isFormValid(): boolean {
    return this.motivo !== '' && this.razon.trim().length >= 10 && this.razon.length <= 500;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    this.submitting = true;

    const reportData = {
      post_id: this.data.postId,
      motivo: this.motivo,
      razon: this.razon.trim()
    };

    this.reportService.createReport(reportData).subscribe({
      next: () => {
        this.submitting = false;
        this.dialogRef.close({ success: true });
      },
      error: (err) => {
        console.error('Error al enviar reporte:', err);
        this.submitting = false;
        alert('Error al enviar el reporte. Intenta de nuevo.');
      }
    });
  }
}