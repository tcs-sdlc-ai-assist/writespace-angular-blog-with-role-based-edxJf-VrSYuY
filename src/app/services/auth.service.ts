import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import type { Session } from '../models/session.model';
import type { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private storageService: StorageService) {}

  login(username: string, password: string): Session | null {
    try {
      if (username === 'admin' && password === 'admin123') {
        const session: Session = {
          userId: 'u_admin',
          username: 'admin',
          displayName: 'Administrator',
          role: 'admin'
        };
        this.storageService.setSession(session);
        return session;
      }

      const users = this.storageService.getUsers();
      const user = users.find(
        (u: User) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (!user) {
        return null;
      }

      const session: Session = {
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role
      };
      this.storageService.setSession(session);
      return session;
    } catch (e) {
      console.error('AuthService: login failed', e);
      return null;
    }
  }

  register(displayName: string, username: string, password: string): { session?: Session; error?: string } {
    try {
      if (!displayName || !username || !password) {
        return { error: 'All fields are required' };
      }

      if (password.length < 4) {
        return { error: 'Password must be at least 4 characters' };
      }

      if (username.toLowerCase() === 'admin') {
        return { error: 'Username already exists' };
      }

      const users = this.storageService.getUsers();
      const exists = users.some(
        (u: User) => u.username.toLowerCase() === username.toLowerCase()
      );

      if (exists) {
        return { error: 'Username already exists' };
      }

      const now = new Date().toISOString();
      const userId = 'u_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

      const newUser: User = {
        id: userId,
        displayName: displayName,
        username: username,
        password: password,
        role: 'user',
        createdAt: now
      };

      this.storageService.addUser(newUser);

      const session: Session = {
        userId: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role
      };
      this.storageService.setSession(session);

      return { session };
    } catch (e) {
      console.error('AuthService: register failed', e);
      return { error: 'Registration failed. Please try again.' };
    }
  }

  logout(): void {
    this.storageService.clearSession();
  }

  getSession(): Session | null {
    return this.storageService.getSession();
  }

  isAdmin(): boolean {
    const session = this.getSession();
    return session !== null && session.role === 'admin';
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}