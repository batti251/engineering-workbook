import { Component, inject, input } from '@angular/core';
import { Clipboard } from '../../services/clipboard';
import { Forms } from '../../services/forms';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-screenshot-upload-area',
  imports: [],
  templateUrl: './screenshot-upload-area.html',
  styleUrl: './screenshot-upload-area.scss',
})
export class ScreenshotUploadArea {
  clipboard = inject(Clipboard)
  forms = inject(Forms)
  db = inject(Supabase)
  edit = input(false)


}
