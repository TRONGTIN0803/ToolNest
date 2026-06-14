import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);
  private nextId = 1;

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  dismiss(id: number): void {
    this.toasts.update((items) => items.filter((toast) => toast.id !== id));
  }

  private show(message: string, type: ToastMessage['type']): void {
    const id = this.nextId++;
    this.toasts.update((items) => [...items, { id, message, type }].slice(-3));
    window.setTimeout(() => this.dismiss(id), 2400);
  }
}
