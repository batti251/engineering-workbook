import { Component, inject, Input, signal } from '@angular/core';
import { Forms } from '../../../../shared/services/forms';
import { FormArray, FormArrayName, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Clipboard } from '../../../../core/clipboard';


@Component({
  selector: 'app-screenshot',
  imports: [ReactiveFormsModule],
  templateUrl: './screenshot.html',
  styleUrl: './screenshot.scss',
})
export class Screenshot {
  clipboard = inject(Clipboard);
  forms = inject(Forms);
  screenshots = signal<FormControl<string>[]>([]);
  @Input() indexSubEntry = 0;
  @Input() formArray!: FormArray<FormControl<string>>;


 
}
