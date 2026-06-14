import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  imports: [FormsModule],
  templateUrl: './search-box.component.html',
})
export class SearchBoxComponent {
  readonly placeholder = 'Search tools by task, category, or keyword';
  readonly search = output<string>();
  readonly term = signal('');

  submit(): void {
    this.search.emit(this.term().trim());
  }
}
