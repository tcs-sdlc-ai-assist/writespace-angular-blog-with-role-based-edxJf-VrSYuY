import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { Post } from '../../models/post.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [NavbarComponent, BlogCardComponent],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  posts: Post[] = [];
  private session: Session | null = null;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session = this.authService.getSession();
    this.loadPosts();
  }

  loadPosts(): void {
    this.posts = this.storageService.getPosts().sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  isOwner(post: Post): boolean {
    if (!this.session) {
      return false;
    }
    if (this.session.role === 'admin') {
      return true;
    }
    return post.authorId === this.session.userId;
  }

  onEditPost(postId: string): void {
    this.router.navigate(['/edit', postId]);
  }

  onDeletePost(postId: string): void {
    this.storageService.removePost(postId);
    this.loadPosts();
  }

  onWriteFirstPost(): void {
    this.router.navigate(['/write']);
  }
}