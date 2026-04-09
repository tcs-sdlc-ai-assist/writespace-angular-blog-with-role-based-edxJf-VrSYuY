import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgClass, DatePipe, TitleCasePipe, UpperCasePipe, SlicePipe } from '@angular/common';
import { AvatarComponent } from '../avatar/avatar.component';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-user-row',
  standalone: true,
  imports: [NgIf, NgClass, DatePipe, TitleCasePipe, UpperCasePipe, SlicePipe, AvatarComponent],
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent {
  @Input() user!: User;
  @Input() currentUserId: string = '';
  @Output() delete = new EventEmitter<string>();

  get isSelf(): boolean {
    return this.user.id === this.currentUserId;
  }

  get isDefaultAdmin(): boolean {
    return this.user.role === 'admin' && this.user.username === 'admin';
  }

  onDelete(): void {
    this.delete.emit(this.user.id);
  }
}