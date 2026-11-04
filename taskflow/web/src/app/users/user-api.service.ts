import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiSuccess, UpdateUserInput, User } from '../core/user.models';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(private readonly http: HttpClient) {}

  getById(id: string): Observable<ApiSuccess<User>> {
    return this.http.get<ApiSuccess<User>>(`${API}/user/${encodeURIComponent(id)}`);
  }

  update(id: string, input: UpdateUserInput): Observable<ApiSuccess<User>> {
    return this.http.patch<ApiSuccess<User>>(`${API}/user/${encodeURIComponent(id)}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/user/${encodeURIComponent(id)}`);
  }
}
