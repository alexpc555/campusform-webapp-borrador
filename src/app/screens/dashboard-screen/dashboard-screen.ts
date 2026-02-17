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
  ],
  templateUrl: './dashboard-screen.html',
  styleUrl: './dashboard-screen.scss',
})
export class DashboardScreen {
  activeSection = 'Inicio';
  activeCategory = 'Todas';

  userType = localStorage.getItem('userType') || 'Alumno';

  searchQuery = '';
  sortBy = 'recent';

  setSection(section: string) {
    this.activeSection = section;
  }

  setCategory(category: string) {
    this.activeCategory = category;
  }
}
