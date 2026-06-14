import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'tools',
    loadComponent: () => import('./pages/tools-list/tools-list.component').then((m) => m.ToolsListComponent),
  },
  {
    path: 'tools/category/:category',
    loadComponent: () => import('./pages/tools-list/tools-list.component').then((m) => m.ToolsListComponent),
  },
  {
    path: 'tools/:slug',
    loadComponent: () => import('./pages/tool-detail/tool-detail.component').then((m) => m.ToolDetailComponent),
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog-list/blog-list.component').then((m) => m.BlogListComponent),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog-detail/blog-detail.component').then((m) => m.BlogDetailComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/static-page/static-page.component').then((m) => m.StaticPageComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/static-page/static-page.component').then((m) => m.StaticPageComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/static-page/static-page.component').then((m) => m.StaticPageComponent),
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/static-page/static-page.component').then((m) => m.StaticPageComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
