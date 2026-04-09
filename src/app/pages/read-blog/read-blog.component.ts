import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { Post } from '../../models/post.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-read-blog',
  standalone: true,
  imports: [NavbarComponent, AvatarComponent, DatePipe],
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.css']
})
export class ReadBlogComponent implements OnInit {
  post: Post | null = null;
  isOwner: boolean = false;
  private session: Session | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.session = this.authService.getSession();
    const postId = this.route.snapshot.paramMap.get('id');

    if (postId) {
      const posts = this.storageService.getPosts();
      this.post = posts.find(p => p.id === postId) || null;
    }

    if (this.post && this.session) {
      this.isOwner = this.post.authorId === this.session.userId || this.session.role === 'admin';
    }
  }

  onEdit(): void {
    if (this.post) {
      this.router.navigate(['/posts/edit', this.post.id]);
    }
  }

  onDelete(): void {
    if (this.post) {
      const confirmed = window.confirm('Are you sure you want to delete this post?');
      if (confirmed) {
        this.storageService.removePost(this.post.id);
        this.router.navigate(['/blogs']);
      }
    }
  }
}