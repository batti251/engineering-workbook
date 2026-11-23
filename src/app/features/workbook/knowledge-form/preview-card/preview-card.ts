import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-preview-card',
  imports: [],
  templateUrl: './preview-card.html',
  styleUrl: './preview-card.scss',
})
export class PreviewCard {
  @Input() type: string = ""

}
