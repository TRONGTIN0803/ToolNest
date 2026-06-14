import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolDefinition } from '../../../core/models/tool.model';

@Component({
  selector: 'app-tool-card',
  imports: [RouterLink],
  templateUrl: './tool-card.component.html',
})
export class ToolCardComponent {
  readonly tool = input.required<ToolDefinition>();
}
