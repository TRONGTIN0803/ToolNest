import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TOOLS } from '../data/tools.config';
import { ToolCategory, ToolDefinition } from '../models/tool.model';

@Injectable({ providedIn: 'root' })
export class ToolService {
  getTools(category?: ToolCategory | string | null): Observable<ToolDefinition[]> {
    const normalized = category?.toString().toLowerCase();
    const tools = normalized
      ? TOOLS.filter((tool) => tool.category.toLowerCase() === normalized)
      : TOOLS;

    return of(tools);
  }

  getToolBySlug(slug: string): Observable<ToolDefinition | undefined> {
    return of(TOOLS.find((tool) => tool.slug === slug));
  }

  getRelatedTools(tool: ToolDefinition): Observable<ToolDefinition[]> {
    const explicitRelated = TOOLS.filter((item) => tool.relatedSlugs.includes(item.slug));
    const explicitSlugs = new Set(explicitRelated.map((item) => item.slug));
    const sourceWords = this.keywordSet(tool);

    const inferredRelated = TOOLS.filter((item) => item.slug !== tool.slug && !explicitSlugs.has(item.slug))
      .map((item) => ({
        item,
        score: this.relatedScore(tool, item, sourceWords),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.id - b.item.id)
      .map((entry) => entry.item);

    return of([...explicitRelated, ...inferredRelated].slice(0, 4));
  }

  getCategories(): Observable<Array<{ name: ToolCategory; slug: string; count: number }>> {
    const categories = Array.from(new Set(TOOLS.map((tool) => tool.category))).map((category) => ({
      name: category,
      slug: category.toLowerCase(),
      count: TOOLS.filter((tool) => tool.category === category).length,
    }));

    return of(categories);
  }

  private relatedScore(source: ToolDefinition, candidate: ToolDefinition, sourceWords: Set<string>): number {
    let score = source.category === candidate.category ? 4 : 0;

    for (const word of this.keywordSet(candidate)) {
      if (sourceWords.has(word)) {
        score += 1;
      }
    }

    return score;
  }

  private keywordSet(tool: ToolDefinition): Set<string> {
    return new Set(
      `${tool.name} ${tool.category} ${tool.description} ${tool.keyword}`
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 3),
    );
  }
}
