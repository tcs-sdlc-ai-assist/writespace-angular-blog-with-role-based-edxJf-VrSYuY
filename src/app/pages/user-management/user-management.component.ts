import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DatePipe, TitleCasePipe, UpperCasePipe, SlicePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserRowComponent } from '../../components/user-row/user-row.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { User } from '../../models/user.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    TitleCasePipe,
    UpperCasePipe,
    SlicePipe,
    ReactiveFormsModule,
    NavbarComponent,
    UserRowComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  createUserForm!: FormGroup;
  currentUserId: string = '';
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  formError: string = '';
  showDeleteConfirm: boolean = false;
  deleteTargetId: string = '';
  deleteTargetName: string = '';

  private session: Session | null = null;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.session = this.authService.getSession();
    if (this.session) {
      this.currentUserId = this.session.userId;
    }

    this.createUserForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    try {
      const storedUsers = this.storageService.getUsers();

      const adminUser: User = {
        id: 'u_admin',
        displayName: 'Administrator',
        username: 'admin',
        password: '',
        role: 'admin',
        createdAt: new Date('2025-01-01T00:00:00Z').toISOString()
      };

      const hasAdmin = storedUsers.some(u => u.id === 'u_admin' || u.username === 'admin');
      if (hasAdmin) {
        this.users = storedUsers;
      } else {
        this.users = [adminUser, ...storedUsers];
      }
    } catch (e) {
      console.error('UserManagement: Failed to load users', e);
      this.users = [];
    }
    this.isLoading = false;
  }

  onCreateUser(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.formError = '';

    const { displayName, username, password, role } = this.createUserForm.value;

    try {
      if (username.toLowerCase() === 'admin') {
        this.formError = 'Username "admin" is reserved.';
        this.isSubmitting = false;
        return;
      }

      const existingUsers = this.storageService.getUsers();
      const exists = existingUsers.some(
        (u: User) => u.username.toLowerCase() === username.toLowerCase()
      );

      if (exists) {
        this.formError = 'Username already exists.';
        this.isSubmitting = false;
        return;
      }

      const now = new Date().toISOString();
      const userId = 'u_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

      const mappedRole: 'admin' | 'user' = role === 'admin' ? 'admin' : 'user';

      const newUser: User = {
        id: userId,
        displayName: displayName,
        username: username,
        password: password,
        role: mappedRole,
        createdAt: now
      };

      this.storageService.addUser(newUser);
      this.createUserForm.reset({ displayName: '', username: '', password: '', role: '' });
      this.loadUsers();
    } catch (e) {
      console.error('UserManagement: Failed to create user', e);
      this.formError = 'Failed to create user. Please try again.';
    }

    this.isSubmitting = false;
  }

  onDeleteUser(userId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return;
    }

    if (user.username === 'admin' && user.role === 'admin') {
      return;
    }

    if (userId === this.currentUserId) {
      return;
    }

    this.deleteTargetId = userId;
    this.deleteTargetName = user.displayName;
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    if (!this.deleteTargetId) {
      this.cancelDelete();
      return;
    }

    try {
      this.storageService.removeUser(this.deleteTargetId);
      this.loadUsers();
    } catch (e) {
      console.error('UserManagement: Failed to delete user', e);
    }

    this.cancelDelete();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deleteTargetId = '';
    this.deleteTargetName = '';
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}