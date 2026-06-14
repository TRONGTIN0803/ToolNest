import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { ToolSearchComponent } from '../tool-search/tool-search.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ToolSearchComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly menuOpen = signal(false);
  readonly theme = inject(ThemeService);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
