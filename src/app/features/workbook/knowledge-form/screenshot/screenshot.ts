import { Component, HostListener, inject, Input, signal } from '@angular/core';
import { Forms } from '../../../../shared/services/forms';
import { FormArray, FormArrayName, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Clipboard } from '../../../../core/clipboard';
import { ActiveScreenshot } from './active-screenshot';

@Component({
  selector: 'app-screenshot',
  imports: [ReactiveFormsModule],
  templateUrl: './screenshot.html',
  styleUrl: './screenshot.scss',
  providers: []
})
export class Screenshot {
  clipboard = inject(Clipboard);
  forms = inject(Forms);
  state = inject(ActiveScreenshot)
  screenshots = signal<FormControl<string>[]>([]);
  @Input() indexSubEntry = 0;
  @Input() formArray!: FormArray<FormControl<string>>;

  setActiveTarget(e: Event, indexSubEntry: number) {
    e.stopPropagation()
    this.state.activeScreenshot.set(indexSubEntry)
  }


  @HostListener('document:click')
  onDocumentClick(): void {
    this.state.activeScreenshot.set(null)
  }
}
