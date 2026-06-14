import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

const PAGE_CONTENT: Record<string, { title: string; description: string; body: string[] }> = {
  about: {
    title: 'About QuickToolHub',
    description: 'QuickToolHub helps people finish small web tasks quickly.',
    body: [
      'QuickToolHub is a free collection of simple online tools for text editing, developer work, images, and daily calculations.',
      'The goal is simple: open a tool, finish the task in your browser, and leave with no account or setup.',
    ],
  },
  contact: {
    title: 'Contact',
    description: 'Contact QuickToolHub for feedback, corrections, and tool ideas.',
    body: [
      'Have feedback, a tool idea, or a correction request? Send a note to hello@quicktoolhub.local while the MVP is being prepared.',
      'For production, this page can connect to a lightweight form endpoint or a static form provider.',
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'Basic privacy policy for QuickToolHub.',
    body: [
      'QuickToolHub tools run in the browser. The MVP does not require personal accounts and does not need to store tool inputs.',
      'Analytics, newsletter forms, cookies, or affiliate tracking should be disclosed here before public launch.',
    ],
  },
  terms: {
    title: 'Terms of Use',
    description: 'Basic terms of use for QuickToolHub.',
    body: [
      'Tools are provided for convenience and general use. Users should verify results before relying on them for important decisions.',
      'Affiliate links or ads may be added in the future and should be clearly disclosed when used.',
    ],
  },
};

@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
})
export class StaticPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly page = computed(() => {
    const key = this.route.snapshot.routeConfig?.path ?? 'about';
    const content = PAGE_CONTENT[key] ?? PAGE_CONTENT['about'];
    this.seo.updateMeta(content.title, content.description, { path: `/${key}` });
    return content;
  });
}
