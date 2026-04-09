import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { Post } from '../../models/post.model';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NavbarComponent, StatCardComponent, DatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalPosts: number = 0;
  totalUsers: number = 0;
  totalComments: number = 0;
  totalViews: number = 0;

  recentPosts: { id: string; title: string; author: string; date: string }[] = [];

  private posts: Post[] = [];
  private users: User[] = [];

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.posts = this.storageService.getPosts();
    this.users = this.storageService.getUsers();

    this.totalPosts = this.posts.length;
    this.totalUsers = this.users.length;
    this.totalComments = this.users.filter(u => u.role === 'admin').length;
    this.totalViews = this.users.filter(u => u.role === 'user').length;

    this.recentPosts = this.posts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.title,
        author: p.authorName,
        date: p.createdAt
      }));
  }

  onCreatePost(): void {
    this.router.navigate(['/write']);
  }

  onManageUsers(): void {
    this.router.navigate(['/users']);
  }

  onViewAnalytics(): void {
    // No-op for MVP
  }

  onSiteSettings(): void {
    // No-op for MVP
  }

  onEditPost(postId: string): void {
    this.router.navigate(['/write', postId]);
  }

  onDeletePost(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.storageService.removePost(postId);
      this.loadData();
    }
  }
}