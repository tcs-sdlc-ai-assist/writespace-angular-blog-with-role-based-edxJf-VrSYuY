import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="avatar-wrapper">
      <div
        class="avatar-circle"
        [style.background-color]="role === 'admin' ? '#7c3aed' : '#4f46e5'"
      >
        <span class="avatar-emoji">{{ role === 'admin' ? '👑' : '📖' }}</span>
      </div>
      <span *ngIf="displayName" class="avatar-name">{{ displayName }}</span>
    </div>
  `,
  styles: [`
    .avatar-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar-emoji {
      font-size: 20px;
      line-height: 1;
    }

    .avatar-name {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
    }
  `]
})
export class AvatarComponent {
  @Input() role: string = 'user';
  @Input() displayName?: string;
}