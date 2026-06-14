import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { ToolSearchComponent } from '../../shared/components/tool-search/tool-search.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ToolSearchComponent],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.updateMeta(
      'Page not found - QuickToolHub',
      'This QuickToolHub page could not be found. Search the tool library or return to the homepage.',
      { path: '/404' },
    );
  }
}
