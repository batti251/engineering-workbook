import { Component, inject, Input } from '@angular/core';
import { Forms } from '../../../../shared/services/forms';
import { FormArray, FormArrayName, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-links',
  imports: [ReactiveFormsModule],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class Links {
  forms = inject(Forms)
  @Input() indexSubEntry = 0;
  @Input() target = '';
  @Input() formArray! : FormArray<FormControl<string>>;
}
