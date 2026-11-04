import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiSuccess, AuthResult, Credentials, RegisterInput, User } from './user.models';

const TOKEN_KEY = 'taskflow.accessToken';
const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenState = signal<string | null>(this.readToken());
  readonly token = this.tokenState.asReadonly();

  constructor(private readonly http: HttpClient) {}

  login(input: Credentials): Observable<ApiSuccess<AuthResult>> {
    return this.http.post<ApiSuccess<AuthResult>>(`${API}/auth/login`, input).pipe(tap((result) => this.save(result.data.accessToken)));
  }

  register(input: RegisterInput): Observable<ApiSuccess<AuthResult>> {
    return this.http.post<ApiSuccess<AuthResult>>(`${API}/auth/register`, input).pipe(tap((result) => this.save(result.data.accessToken)));
  }

  me(): Observable<ApiSuccess<User>> {
    return this.http.get<ApiSuccess<User>>(`${API}/auth/me`);
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(TOKEN_KEY);
    this.tokenState.set(null);
  }

  private readToken(): string | null {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
  }

  private save(token: string): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
    this.tokenState.set(token);
  }
}
