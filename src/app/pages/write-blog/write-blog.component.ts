import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { Post } from '../../models/post.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-write-blog',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent],
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.css']
})
export class WriteBlogComponent implements OnInit {
  blogForm!: FormGroup;
  isEditMode: boolean = false;
  isSaving: boolean = false;
  maxContentLength: number = 5000;
  contentLength: number = 0;

  private postId: string | null = null;
  private session: Session | null = null;
  private existingPost: Post | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.session = this.authService.getSession();

    if (!this.session) {
      this.router.navigate(['/login']);
      return;
    }

    this.blogForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      content: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(this.maxContentLength)
      ])
    });

    this.blogForm.get('content')?.valueChanges.subscribe((value: string) => {
      this.contentLength = value ? value.length : 0;
    });

    this.postId = this.route.snapshot.paramMap.get('id');

    if (this.postId) {
      this.isEditMode = true;
      this.loadPost(this.postId);
    }
  }

  private loadPost(id: string): void {
    const posts = this.storageService.getPosts();
    const post = posts.find(p => p.id === id);

    if (!post) {
      this.router.navigate(['/blogs']);
      return;
    }

    if (!this.session) {
      this.router.navigate(['/login']);
      return;
    }

    const isOwner = post.authorId === this.session.userId;
    const isAdmin = this.session.role === 'admin';

    if (!isOwner && !isAdmin) {
      this.router.navigate(['/blogs']);
      return;
    }

    this.existingPost = post;
    this.blogForm.patchValue({
      title: post.title,
      content: post.content
    });
    this.contentLength = post.content ? post.content.length : 0;
  }

  onSave(): void {
    if (this.blogForm.invalid || this.isSaving || !this.session) {
      return;
    }

    this.isSaving = true;

    const title = this.blogForm.get('title')?.value?.trim() ?? '';
    const content = this.blogForm.get('content')?.value?.trim() ?? '';

    if (this.isEditMode && this.existingPost) {
      const updatedPost: Post = {
        ...this.existingPost,
        title: title,
        content: content
      };
      this.storageService.updatePost(updatedPost);
      this.isSaving = false;
      this.router.navigate(['/blog', updatedPost.id]);
    } else {
      const now = new Date().toISOString();
      const postId = 'p_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

      const newPost: Post = {
        id: postId,
        title: title,
        content: content,
        createdAt: now,
        authorId: this.session.userId,
        authorName: this.session.displayName
      };

      this.storageService.addPost(newPost);
      this.isSaving = false;
      this.router.navigate(['/blog', newPost.id]);
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.existingPost) {
      this.router.navigate(['/blog', this.existingPost.id]);
    } else {
      this.router.navigate(['/blogs']);
    }
  }
}