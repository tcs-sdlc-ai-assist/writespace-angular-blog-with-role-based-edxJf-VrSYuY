import { Injectable } from '@angular/core';
import { User } from '@app/models/user.model';
import { Post } from '@app/models/post.model';
import { Session } from '@app/models/session.model';

const USERS_KEY = 'writespace_users';
const POSTS_KEY = 'writespace_posts';
const SESSION_KEY = 'writespace_session';

@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor() {
    this.seedIfNeeded();
  }

  getUsers(): User[] {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed as User[];
    } catch (e) {
      console.error('StorageService: Failed to read users from localStorage', e);
      return [];
    }
  }

  addUser(user: User): void {
    try {
      const users = this.getUsers();
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('StorageService: Failed to add user to localStorage', e);
    }
  }

  removeUser(userId: string): void {
    try {
      const users = this.getUsers().filter(u => u.id !== userId);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('StorageService: Failed to remove user from localStorage', e);
    }
  }

  getPosts(): Post[] {
    try {
      const raw = localStorage.getItem(POSTS_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed as Post[];
    } catch (e) {
      console.error('StorageService: Failed to read posts from localStorage', e);
      return [];
    }
  }

  addPost(post: Post): void {
    try {
      const posts = this.getPosts();
      posts.push(post);
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('StorageService: Failed to add post to localStorage', e);
    }
  }

  updatePost(post: Post): void {
    try {
      const posts = this.getPosts().map(p => p.id === post.id ? post : p);
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('StorageService: Failed to update post in localStorage', e);
    }
  }

  removePost(postId: string): void {
    try {
      const posts = this.getPosts().filter(p => p.id !== postId);
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('StorageService: Failed to remove post from localStorage', e);
    }
  }

  getSession(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }
      return parsed as Session;
    } catch (e) {
      console.error('StorageService: Failed to read session from localStorage', e);
      return null;
    }
  }

  setSession(session: Session): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('StorageService: Failed to set session in localStorage', e);
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error('StorageService: Failed to clear session from localStorage', e);
    }
  }

  seedIfNeeded(): void {
    try {
      const existingUsers = localStorage.getItem(USERS_KEY);
      if (!existingUsers) {
        const seedUsers: User[] = [
          {
            id: 'u_seed_jane',
            displayName: 'Jane Writer',
            username: 'jane',
            password: 'jane1234',
            role: 'user',
            createdAt: new Date('2025-01-10T08:00:00Z').toISOString()
          },
          {
            id: 'u_seed_bob',
            displayName: 'Bob Blogger',
            username: 'bob',
            password: 'bob12345',
            role: 'user',
            createdAt: new Date('2025-01-12T10:30:00Z').toISOString()
          }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
      }

      const existingPosts = localStorage.getItem(POSTS_KEY);
      if (!existingPosts) {
        const seedPosts: Post[] = [
          {
            id: 'p_seed_001',
            title: 'Getting Started with Angular 17',
            content: 'Angular 17 introduces a new control flow syntax with @if and @for, standalone components by default, and improved performance. In this post, we explore the key features that make Angular 17 a game-changer for modern web development. The new template syntax is more intuitive and reduces boilerplate significantly.',
            createdAt: new Date('2025-01-11T09:00:00Z').toISOString(),
            authorId: 'u_seed_jane',
            authorName: 'Jane Writer'
          },
          {
            id: 'p_seed_002',
            title: 'Why I Love Writing',
            content: 'Writing is more than just putting words on a page. It is a way to organize thoughts, share experiences, and connect with others. Whether you are journaling, blogging, or crafting fiction, the act of writing helps clarify your thinking and gives your ideas a permanent home. Start writing today and discover the power of your own voice.',
            createdAt: new Date('2025-01-13T14:30:00Z').toISOString(),
            authorId: 'u_seed_bob',
            authorName: 'Bob Blogger'
          },
          {
            id: 'p_seed_003',
            title: 'Building a Blog Platform with No Backend',
            content: 'Sometimes you do not need a full backend to build a useful application. By leveraging localStorage and Angular services, you can create a fully functional blog platform that runs entirely in the browser. This approach is perfect for demos, prototypes, and learning projects where simplicity and speed matter more than scalability.',
            createdAt: new Date('2025-01-14T11:15:00Z').toISOString(),
            authorId: 'u_seed_jane',
            authorName: 'Jane Writer'
          }
        ];
        localStorage.setItem(POSTS_KEY, JSON.stringify(seedPosts));
      }
    } catch (e) {
      console.error('StorageService: Failed to seed data in localStorage', e);
    }
  }
}