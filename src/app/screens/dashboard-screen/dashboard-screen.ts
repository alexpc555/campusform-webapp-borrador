import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewPostModal } from '../../partials/new-post-modal/new-post-modal';

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

    MatDialogModule,
  ],
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
