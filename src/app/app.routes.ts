import { Routes } from '@angular/router';
import { authGuard } from '@app/guards/auth.guard';
import { adminGuard } from '@app/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@app/pages/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@app/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      )
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@app/pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      )
  },
  {
    path: 'blogs',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/blog-list/blog-list.component').then(
        (m) => m.BlogListComponent
      )
  },
  {
    path: 'write',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/write-blog/write-blog.component').then(
        (m) => m.WriteBlogComponent
      )
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/write-blog/write-blog.component').then(
        (m) => m.WriteBlogComponent
      )
  },
  {
    path: 'blog/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/pages/read-blog/read-blog.component').then(
        (m) => m.ReadBlogComponent
      )
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('@app/pages/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      )
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('@app/pages/user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      )
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];