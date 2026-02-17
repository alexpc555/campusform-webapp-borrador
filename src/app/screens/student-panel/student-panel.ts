import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Publication {
    id: number;
    title: string;
    body: string;
    date: string;
}

interface Comment {
    id: number;
    postTitle: string;
    content: string;
    date: string;
    timeAgo: string;
}

interface Report {
    id: number;
    type: string;
    status: 'Pendiente' | 'Resuelto' | 'Rechazado';
    title: string;
    reason: string;
    description: string;
    date: string;
    timeAgo: string;
}

@Component({
    selector: 'app-student-panel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './student-panel.html',
    styleUrls: ['./student-panel.scss']
})
export class StudentPanelComponent {
    activeTab: 'posts' | 'comments' | 'reports' = 'comments'; 

    myPosts: Publication[] = []; // Empty state for now

    myComments: Comment[] = [
        {
            id: 1,
            postTitle: 'Pregunta sobre Cálculo Diferencial - Límites',
            content: 'Puedes usar la regla de L\'Hôpital cuando tienes formas indeterminadas como 0/0 o ∞/∞',
            date: '2023-10-25',
            timeAgo: 'Hace 1 hora'
        },
        {
            id: 2,
            postTitle: 'Horarios de Biblioteca para exámenes finales',
            content: 'Gracias por la información! Muy útil para planear mis sesiones de estudio.',
            date: '2023-10-24',
            timeAgo: 'Hace 2 días'
        }
    ];

    myReports: Report[] = [
        {
            id: 1,
            type: 'Publicación',
            status: 'Pendiente',
            title: 'Contenido spam inapropiado',
            reason: 'Spam o publicidad',
            description: 'Este post contiene publicidad no relacionada con temas académicos',
            date: '2023-10-25',
            timeAgo: 'Hace 1 día'
        }
    ];

    setActiveTab(tab: 'posts' | 'comments' | 'reports') {
        this.activeTab = tab;
    }
}
