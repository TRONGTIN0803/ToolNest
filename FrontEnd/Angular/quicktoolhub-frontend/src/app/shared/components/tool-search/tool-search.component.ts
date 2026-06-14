import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToolDefinition } from '../../../core/models/tool.model';
import { ToolService } from '../../../core/services/tool.service';

@Component({
  selector: 'app-tool-search',
  imports: [FormsModule],
  templateUrl: './tool-search.component.html',
})
export class ToolSearchComponent {
  private readonly router = inject(Router);
  private readonly toolService = inject(ToolService);

  readonly query = signal('');
  readonly open = signal(false);
  readonly tools = signal<ToolDefinition[]>([]);

  readonly results = computed(() => {
    const searchTerm = this.query().trim().toLowerCase();

    if (!searchTerm) {
      return this.tools().slice(0, 5);
    }

    return this.tools()
      .filter((tool) => this.searchText(tool).includes(searchTerm))
      .slice(0, 7);
  });

  constructor() {
    this.toolService.getTools().subscribe((tools) => this.tools.set(tools));
  }

  showResults(): void {
    this.open.set(true);
  }

  hideResults(): void {
    window.setTimeout(() => this.open.set(false), 120);
  }

  submitFirstResult(): void {
    const firstResult = this.results()[0];

    if (firstResult) {
      this.openTool(firstResult);
    }
  }

  openTool(tool: ToolDefinition): void {
    this.query.set('');
    this.open.set(false);
    void this.router.navigate(['/tools', tool.slug]);
  }

  private searchText(tool: ToolDefinition): string {
    return `${tool.name} ${tool.category} ${tool.description} ${tool.keyword}`.toLowerCase();
  }
}
