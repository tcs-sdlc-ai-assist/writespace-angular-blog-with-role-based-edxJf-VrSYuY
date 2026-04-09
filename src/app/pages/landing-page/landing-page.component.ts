import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PublicNavbarComponent } from '../../components/public-navbar/public-navbar.component';
import { StorageService } from '../../services/storage.service';
import type { Post } from '../../models/post.model';

interface PostPreview {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, DatePipe, PublicNavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  latestPosts: PostPreview[] = [];
  isLoading: boolean = true;
  currentYear: number = new Date().getFullYear();

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadLatestPosts();
  }

  private loadLatestPosts(): void {
    try {
      const posts: Post[] = this.storageService.getPosts();
      const sorted = [...posts].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.latestPosts = sorted.slice(0, 3).map((post: Post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content,
        author: post.authorName,
        createdAt: post.createdAt
      }));
    } catch (e) {
      console.error('LandingPageComponent: Failed to load latest posts', e);
      this.latestPosts = [];
    } finally {
      this.isLoading = false;
    }
  }
}