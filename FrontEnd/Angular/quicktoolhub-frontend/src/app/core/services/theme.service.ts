import { Injectable, signal } from '@angular/core';

type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'qth_theme_mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.loadTheme());

  isDark(): boolean {
    return this.mode() === 'dark';
  }

  toggle(): void {
    this.setMode(this.isDark() ? 'light' : 'dark');
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }

  private loadTheme(): ThemeMode {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' ? 'light' : 'dark';
  }
}
