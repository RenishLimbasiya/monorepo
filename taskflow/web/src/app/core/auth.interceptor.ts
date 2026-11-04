import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'taskflow.accessToken';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/v1/') || typeof localStorage === 'undefined') return next(request);
  const token = localStorage.getItem(TOKEN_KEY);
  return next(token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request);
};
