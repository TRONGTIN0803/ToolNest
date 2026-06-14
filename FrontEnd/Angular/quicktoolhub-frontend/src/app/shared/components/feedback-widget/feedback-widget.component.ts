import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FeedbackType } from '../../../core/models/feedback.model';
import { FeedbackService } from '../../../core/services/feedback.service';

@Component({
  selector: 'app-feedback-widget',
  imports: [FormsModule],
  templateUrl: './feedback-widget.component.html',
})
export class FeedbackWidgetComponent {
  private readonly feedbackService = inject(FeedbackService);
  private readonly router = inject(Router);

  readonly open = signal(false);
  readonly type = signal<FeedbackType>('bug');
  readonly message = signal('');
  readonly email = signal('');
  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly error = signal('');
  readonly currentUrl = signal(this.router.url);
  readonly toolSlug = computed(() => {
    const match = this.currentUrl().match(/^\/tools\/([^/?#]+)/);
    return match && match[1] !== 'category' ? match[1] : '';
  });

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.currentUrl.set((event as NavigationEnd).urlAfterRedirects);
    });
  }

  toggle(): void {
    this.open.update((value) => !value);
    this.error.set('');
  }

  submit(): void {
    const message = this.message().trim();
    if (message.length < 3) {
      this.error.set('Please enter a little more detail.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.feedbackService
      .submitFeedback({
        toolSlug: this.toolSlug() || undefined,
        pageUrl: window.location.href,
        type: this.type(),
        message,
        email: this.email().trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.submitted.set(true);
          this.message.set('');
          this.email.set('');
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Could not save feedback. Please try again.');
        },
      });
  }
}
