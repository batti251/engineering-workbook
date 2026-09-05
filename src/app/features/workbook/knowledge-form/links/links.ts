import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { Forms } from '../../../../shared/services/forms';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-links',
  imports: [ReactiveFormsModule],
  templateUrl: './links.html',
  styleUrl: './links.scss',
})
export class Links {
  forms = inject(Forms)
  cdr = inject(ChangeDetectorRef)
  @Input() indexSubEntry = 0;
  @Input() target = '';
  @Input() formArray! : FormArray<FormControl<string>>;

  ngOnInit(){
    this.formArray.valueChanges.pipe().subscribe(() => {
      this.cdr.markForCheck()
    })
  }
}
