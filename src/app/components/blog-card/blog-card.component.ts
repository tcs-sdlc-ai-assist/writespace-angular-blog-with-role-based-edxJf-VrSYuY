import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { AvatarComponent } from '../avatar/avatar.component';
import type { Post } from '../../models/post.model';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, DatePipe, SlicePipe, AvatarComponent],
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent {
  @Input() post!: Post;
  @Input() isOwner: boolean = false;

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.post.id);
  }

  onDelete(): void {
    this.delete.emit(this.post.id);
  }

  getExcerpt(): string {
    if (!this.post.content) {
      return '';
    }
    if (this.post.content.length > 150) {
      return this.post.content.slice(0, 150) + '...';
    }
    return this.post.content;
  }

  getAuthorInitial(): string {
    if (this.post.authorName && this.post.authorName.length > 0) {
      return this.post.authorName.charAt(0).toUpperCase();
    }
    return '?';
  }
}