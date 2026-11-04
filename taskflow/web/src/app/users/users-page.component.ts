import { Component, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { User } from '../core/user.models';
import { UserApiService } from './user-api.service';

@Component({
  selector: 'app-users-page',
  imports: [FormsModule, DatePipe],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css',
})
export class UsersPageComponent implements OnInit {
  readonly user = signal<User | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly mode = signal<'login' | 'register'>('login');
  readonly editing = signal(false);
  email = '';
  name = '';
  password = '';
  editEmail = '';
  editName = '';
  editPassword = '';

  constructor(readonly auth: AuthService, private readonly users: UserApiService) {}

  ngOnInit(): void {
    if (this.auth.token()) this.loadUser();
  }

  setMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.error.set('');
  }

  submitAuth(): void {
    this.error.set('');
    this.loading.set(true);
    const request = this.mode() === 'login'
      ? this.auth.login({ email: this.email.trim(), password: this.password })
      : this.auth.register({ email: this.email.trim(), password: this.password, ...(this.name.trim() ? { name: this.name.trim() } : {}) });
    request.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (result) => { this.user.set(result.data.user); this.password = ''; },
      error: (error: HttpErrorResponse) => this.error.set(this.errorMessage(error, 'Could not authenticate.')),
    });
  }

  loadUser(): void {
    this.error.set('');
    this.loading.set(true);
    this.auth.me().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (result) => this.user.set(result.data),
      error: (error: HttpErrorResponse) => {
        this.error.set(this.errorMessage(error, 'Could not load your account.'));
        if (error.status === 401) { this.auth.logout(); this.user.set(null); }
      },
    });
  }

  beginEdit(): void {
    const user = this.user();
    if (!user) return;
    this.editEmail = user.email;
    this.editName = user.name ?? '';
    this.editPassword = '';
    this.editing.set(true);
    this.error.set('');
  }

  saveUser(): void {
    const user = this.user();
    if (!user) return;
    const input = {
      email: this.editEmail.trim(),
      name: this.editName.trim() || null,
      ...(this.editPassword ? { password: this.editPassword } : {}),
    };
    this.error.set('');
    this.saving.set(true);
    this.users.update(user.id, input).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (result) => { this.user.set(result.data); this.editing.set(false); this.editPassword = ''; },
      error: (error: HttpErrorResponse) => this.error.set(this.errorMessage(error, 'Could not update your account.')),
    });
  }

  deleteUser(): void {
    const user = this.user();
    if (!user || !window.confirm('Permanently delete your account? This cannot be undone.')) return;
    this.error.set('');
    this.saving.set(true);
    this.users.delete(user.id).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => { this.auth.logout(); this.user.set(null); this.editing.set(false); },
      error: (error: HttpErrorResponse) => this.error.set(this.errorMessage(error, 'Could not delete your account.')),
    });
  }

  logout(): void {
    this.auth.logout();
    this.user.set(null);
    this.editing.set(false);
    this.error.set('');
  }

  private errorMessage(error: HttpErrorResponse, fallback: string): string {
    return error.error?.error?.message ?? error.error?.message ?? fallback;
  }
}
