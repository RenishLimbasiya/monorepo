import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./users/users-page.component').then((module) => module.UsersPageComponent),
  },
  { path: '**', redirectTo: '' },
];
