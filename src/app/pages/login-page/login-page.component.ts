import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicNavbarComponent } from '../../components/public-navbar/public-navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PublicNavbarComponent],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const session = this.authService.getSession();
      if (session && session.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/blogs']);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const username = this.loginForm.get('username')?.value?.trim() ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    const session = this.authService.login(username, password);

    if (session) {
      if (session.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/blogs']);
      }
    } else {
      this.errorMessage = 'Invalid username or password. Please try again.';
      this.isLoading = false;
    }
  }
}