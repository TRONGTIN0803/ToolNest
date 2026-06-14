import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogPost } from '../../core/models/blog-post.model';
import { ToolDefinition } from '../../core/models/tool.model';
import { BlogService } from '../../core/services/blog.service';
import { SeoService } from '../../core/services/seo.service';
import { ToolService } from '../../core/services/tool.service';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink, ToolCardComponent],
  templateUrl: './blog-detail.component.html',
})
export class BlogDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);
  private readonly toolService = inject(ToolService);
  private readonly seo = inject(SeoService);

  readonly post = signal<BlogPost | undefined>(undefined);
  readonly relatedTools = signal<ToolDefinition[]>([]);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.blogService.getPostBySlug(slug).subscribe((post) => {
        this.post.set(post);
        if (post) {
          this.seo.updateMeta(post.title, post.excerpt, { path: `/blog/${post.slug}`, type: 'article' });
          this.loadRelatedTools(post.relatedToolSlugs ?? []);
        }
      });
    });
  }

  private loadRelatedTools(slugs: string[]): void {
    this.toolService.getTools().subscribe((tools) => {
      this.relatedTools.set(tools.filter((tool) => slugs.includes(tool.slug)));
    });
  }
}
