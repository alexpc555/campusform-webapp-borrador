import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-page',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './analytics-page.html',

  styleUrls: ['./analytics-page.scss']

})
export class AnalyticsPageComponent {

  stats = [

    {
      label: 'Total Usuarios',
      value: '2,605',
      growth: '+12%',
      icon: 'bi bi-people'
    },

    {
      label: 'Publicaciones',
      value: '822',
      growth: '+8%',
      icon: 'bi bi-chat-left-text'
    },

    {
      label: 'Comentarios',
      value: '4,327',
      growth: '+18%',
      icon: 'bi bi-graph-up'
    },

    {
      label: 'Vistas',
      value: '28.5K',
      growth: '+15%',
      icon: 'bi bi-eye'
    }

  ];

  postsPerCategory = [

    { name: "Matemáticas", posts: 245, color: "#002D62" },

    { name: "Programación", posts: 189, color: "#C8A961" },

    { name: "Física", posts: 156, color: "#3b82f6" },

    { name: "Campus", posts: 98, color: "#8b5cf6" },

    { name: "Tecnología", posts: 134, color: "#ec4899" }

  ];

  activeUsersData = [

    { month: "Ago", students: 420 },

    { month: "Sep", students: 580 },

    { month: "Oct", students: 890 },

    { month: "Nov", students: 1200 },

    { month: "Dic", students: 1450 },

    { month: "Ene", students: 2100 },

    { month: "Feb", students: 2500 }

  ];

}