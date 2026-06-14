import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolDefinition } from '../../core/models/tool.model';
import { SeoService } from '../../core/services/seo.service';
import { ToolService } from '../../core/services/tool.service';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';

@Component({
  selector: 'app-tools-list',
  imports: [FormsModule, RouterLink, ToolCardComponent],
  templateUrl: './tools-list.component.html',
})
export class ToolsListComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly toolService = inject(ToolService);
  private readonly seo = inject(SeoService);

  readonly tools = signal<ToolDefinition[]>([]);
  readonly categories = signal<Array<{ name: string; slug: string; count: number }>>([]);
  readonly activeCategory = signal<string>('');
  readonly query = signal('');

  readonly categoryInfo = computed(() => {
    const slug = this.activeCategory();
    return this.categoryDetails(slug);
  });

  readonly filteredTools = computed(() => {
    const searchTerm = this.query().trim().toLowerCase();

    if (!searchTerm) {
      return this.tools();
    }

    return this.tools().filter((tool) => {
      const searchableText = `${tool.name} ${tool.category} ${tool.description} ${tool.keyword}`.toLowerCase();
      return searchableText.includes(searchTerm);
    });
  });

  constructor() {
    this.toolService.getCategories().subscribe((categories) => this.categories.set(categories));

    this.route.paramMap.subscribe((params) => {
      const category = params.get('category') ?? '';
      this.activeCategory.set(category);
      this.seo.updateMeta(
        category ? `${this.categoryDetails(category).title} tools` : 'Free online tools',
        category
          ? this.categoryDetails(category).description
          : 'Fast browser-based tools for text, developer tasks, images, and daily calculations.',
        { path: category ? `/tools/category/${category}` : '/tools' },
      );
      this.toolService.getTools(category).subscribe((tools) => this.tools.set(tools));
    });
  }

  labelFromSlug(slug: string): string {
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }

  private categoryDetails(slug: string): { title: string; eyebrow: string; description: string; highlights: string[] } {
    const details: Record<string, { title: string; eyebrow: string; description: string; highlights: string[] }> = {
      calculator: {
        title: 'Calculator',
        eyebrow: 'Decision and date helpers',
        description: 'Quick calculators for dates, random choices, and practical everyday decisions.',
        highlights: ['Fast answers', 'No saved history', 'Good for small decisions'],
      },
      developer: {
        title: 'Developer',
        eyebrow: 'Browser utilities for builders',
        description: 'Format, encode, generate, encrypt, and inspect small pieces of development data without opening a heavy app.',
        highlights: ['Local-first utilities', 'Copy-ready output', 'Useful for test data'],
      },
      image: {
        title: 'Image',
        eyebrow: 'Lightweight visual helpers',
        description: 'Simple browser tools for small visual tasks such as QR generation and shareable image helpers.',
        highlights: ['No design app needed', 'Quick previews', 'Simple output'],
      },
      text: {
        title: 'Text',
        eyebrow: 'Writing and naming tools',
        description: 'Clean, count, convert, and generate text for writing, content tasks, game names, and quick formatting.',
        highlights: ['Writing checks', 'Name generation', 'Text cleanup'],
      },
    };

    return (
      details[slug] ?? {
        title: 'Free online',
        eyebrow: 'Tool library',
        description: 'Choose a tool, finish the task in your browser, and move on. No account required.',
        highlights: ['No account required', 'Browser-first', 'Free to use'],
      }
    );
  }
}
