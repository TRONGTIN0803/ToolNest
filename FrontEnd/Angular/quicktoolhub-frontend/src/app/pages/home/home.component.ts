import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolDefinition } from '../../core/models/tool.model';
import { SeoService } from '../../core/services/seo.service';
import { ToolService } from '../../core/services/tool.service';
import { ToolCardComponent } from '../../shared/components/tool-card/tool-card.component';
import { ToolSearchComponent } from '../../shared/components/tool-search/tool-search.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ToolCardComponent, ToolSearchComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly toolService = inject(ToolService);
  private readonly seo = inject(SeoService);

  readonly tools = signal<ToolDefinition[]>([]);
  readonly newTools = signal<ToolDefinition[]>([]);
  readonly categories = signal<Array<{ name: string; slug: string; count: number }>>([]);
  readonly toolCount = signal(0);

  constructor() {
    this.seo.updateMeta(
      'QuickToolHub - free online utility tools',
      'A fast collection of free browser tools for text editing, developer utilities, QR codes, passwords, and daily calculations.',
      { path: '/' },
    );

    this.toolService.getTools().subscribe((tools) => {
      this.toolCount.set(tools.length);
      this.tools.set(tools.slice(0, 8));
      this.newTools.set(tools.slice(-4).reverse());
    });
    this.toolService.getCategories().subscribe((categories) => this.categories.set(categories));
  }

  categorySummary(slug: string): string {
    const summaries: Record<string, string> = {
      calculator: 'Pick outcomes, calculate dates, and make quick everyday decisions.',
      developer: 'Format, encode, encrypt, and generate clean test data in the browser.',
      image: 'Create lightweight visual assets without opening a full design app.',
      text: 'Clean, count, convert, and generate text for writing or games.',
    };

    return summaries[slug] ?? 'Open tools for this category.';
  }
}
