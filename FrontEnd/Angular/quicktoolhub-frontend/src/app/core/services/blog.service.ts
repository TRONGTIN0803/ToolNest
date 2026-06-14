import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_BLOG_POSTS } from '../data/mock-data';
import { BlogPost } from '../models/blog-post.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getPosts(): Observable<BlogPost[]> {
    if (environment.useMockData) {
      return of(MOCK_BLOG_POSTS).pipe(delay(130));
    }

    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts`).pipe(catchError(() => of(MOCK_BLOG_POSTS)));
  }

  getPostBySlug(slug: string): Observable<BlogPost | undefined> {
    if (environment.useMockData) {
      return of(MOCK_BLOG_POSTS.find((post) => post.slug === slug)).pipe(delay(100));
    }

    return this.http
      .get<BlogPost>(`${this.apiUrl}/posts/${slug}`)
      .pipe(catchError(() => of(MOCK_BLOG_POSTS.find((post) => post.slug === slug))));
  }
}
