import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewPostModal } from '../../partials/new-post-modal/new-post-modal';

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './dashboard-screen.html',
  styleUrl: './dashboard-screen.scss',
})
export class DashboardScreen {
  activeSection = 'Inicio';
  activeCategory = 'Todas';

  // ✅ para tu [(ngModel)]
  searchQuery = '';
  sortBy: 'recent' | 'popular' | 'comments' = 'recent';

  userType = localStorage.getItem('userType') || 'Alumno';

  constructor(private dialog: MatDialog) {}

  setSection(section: string) {
    this.activeSection = section;
  }

  setCategory(category: string) {
    this.activeCategory = category;
  }

  openNewPostModal() {
    const dialogRef = this.dialog.open(NewPostModal, {
      width: '720px',
      maxWidth: '92vw',
      panelClass: 'cf-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Modal result:', result);
    });
  }
}
