import { Component, inject } from '@angular/core';
import { Clipboard } from '../../services/clipboard';

@Component({
  selector: 'app-screenshot-upload-area',
  imports: [],
  templateUrl: './screenshot-upload-area.html',
  styleUrl: './screenshot-upload-area.scss',
})
export class ScreenshotUploadArea {
  clipboard = inject(Clipboard)
}
