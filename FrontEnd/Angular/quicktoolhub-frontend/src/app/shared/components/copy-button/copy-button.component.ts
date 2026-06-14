import { Component, inject, input, signal } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
})
export class CopyButtonComponent {
  private readonly toast = inject(ToastService);
  readonly text = input.required<string>();
  readonly label = input('Copy');
  readonly copied = signal(false);

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.text());
      this.copied.set(true);
      this.toast.success('Copied to clipboard');
      window.setTimeout(() => this.copied.set(false), 1800);
    } catch {
      this.toast.error('Could not copy text');
    }
  }
}
