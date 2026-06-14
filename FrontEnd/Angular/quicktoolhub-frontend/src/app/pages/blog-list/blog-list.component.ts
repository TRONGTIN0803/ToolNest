import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../core/models/blog-post.model';
import { BlogService } from '../../core/services/blog.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-blog-list',
  imports: [RouterLink],
  templateUrl: './blog-list.component.html',
})
export class BlogListComponent {
  private readonly blogService = inject(BlogService);
  private readonly seo = inject(SeoService);
  readonly posts = signal<BlogPost[]>([]);

  constructor() {
    this.seo.updateMeta(
      'Utility tools blog',
      'Guides for using online tools for writing, developer work, passwords, QR codes, and everyday calculations.',
      { path: '/blog' },
    );
    this.blogService.getPosts().subscribe((posts) => this.posts.set(posts));
  }
}
