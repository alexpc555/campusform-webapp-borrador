import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AnalyticsSummary {
  total_users: number;
  total_posts: number;
  total_comments: number;
  avg_comments_per_post: number;
}

export interface PostsPerCategory {
  name: string;
  posts: number;
}

export interface TopUser {
  name: string;
  posts: number;
  comments: number;
  activity: number;
}

export interface AnalyticsDashboardResponse {
  summary: AnalyticsSummary;
  posts_per_category: PostsPerCategory[];
  top_users: TopUser[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/analytics/dashboard/`;

  getDashboard(): Observable<AnalyticsDashboardResponse> {
    return this.http.get<AnalyticsDashboardResponse>(this.apiUrl);
  }
}