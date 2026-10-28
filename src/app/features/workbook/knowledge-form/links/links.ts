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
  @Input() formArray!: FormArray<FormControl<string>>;

  ngOnInit() {
    this.formArray.valueChanges.pipe().subscribe(() => {
      this.cdr.markForCheck()
    })
  }

  change(item: FormControl<string>[], position: number, newPosition: ("moveUp" | "moveDown")) {
    console.log(item);
    console.log(position);
    console.log(newPosition);
    let toChangeElements

    switch (newPosition) {
      case "moveUp":
        toChangeElements = item.slice(position - 1, position + 1).reverse();
        item.splice(position - 1, 2, ...toChangeElements)
        break;
      case "moveDown":
        toChangeElements = item.slice(position, position + 2).reverse();
        item.splice(position, position + 2, ...toChangeElements)
        break
    }
    console.log(item);
    /* console.log(this.formArray.patchValue()); */
    
  }

  changePosition(indexSubEntry: number, newPosition: ("shiftRight" | "shiftLeft")) {
    let targetIndex
    let toChangeElements
    let originalSubEntries = this.forms.entryForm.controls.subEntries.controls

    switch (newPosition) {
      case "shiftRight":
        targetIndex = indexSubEntry + 2
        toChangeElements = this.forms.entryForm.controls.subEntries.controls.slice(indexSubEntry, targetIndex).reverse()
        originalSubEntries.splice(indexSubEntry, 2, ...toChangeElements)
        break;

      case "shiftLeft":
        targetIndex = indexSubEntry - 1
        indexSubEntry += 1
        toChangeElements = this.forms.entryForm.controls.subEntries.controls.slice(targetIndex, indexSubEntry).reverse()
        originalSubEntries.splice(targetIndex, indexSubEntry, ...toChangeElements)
        break;

    }
    this.forms.entryForm.patchValue({
      subEntries: this.forms.entryForm.controls.subEntries.controls as Partial<{
        subTitle: string | null;
        description: string | null;
        code: Partial<{
          isCode: boolean | null;
          language: string | null;
        }>;
        details: (string | null)[];
        externalLinks: (string | null)[];
        screenshots: (string | null)[];
      }>[]
    });
  }
}
