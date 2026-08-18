import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TableRow } from '../../../interfaces/table-row';
import { FormModel } from '../../../models/form-model';
import { Supabase } from '../../../services/supabase';
import { Clipboard } from '../../../services/clipboard';
import { ScreenshotUploadArea } from '../../../components/screenshot-upload-area/screenshot-upload-area';

@Component({
  selector: 'app-coding-add',
  imports: [ReactiveFormsModule, ScreenshotUploadArea],
  templateUrl: './coding-add.html',
  styleUrl: './coding-add.scss',
})
export class CodingAdd {
  db = inject(Supabase)
  clipboard = inject(Clipboard)
  private formBuilder = inject(FormBuilder);

  surveyForm = this.formBuilder.group({
    language: ['', Validators.required],
    description: ['', Validators.required],
    syntax: ['', Validators.required],
    return_value: ['', Validators.required],
    properties: this.formBuilder.array([]),
    use_cases: this.formBuilder.array([]),
    screenshots: this.formBuilder.array([])
  });

  ngOnInit() {
    this.db.readDB()
  }



  get useCases() {
    return this.surveyForm.get('use_cases') as FormArray;
  }

  addUseCase() {
    this.useCases.push(this.formBuilder.control(''));
  }

  get properties() {
    return this.surveyForm.get('properties') as FormArray;
  }

  addProperty() {
    this.properties.push(this.formBuilder.control(''));
  }

  get screenshots() {
    return this.surveyForm.get('screenshots') as FormArray;
  }

  /**
   * 
   */
  async addScreenshotsToDB() {
    for (const file of this.clipboard.files) {
      let screenshotURL = await this.db.addScrenshot(this.screenshots, file)
      this.screenshots.push(this.formBuilder.control(screenshotURL))
    }
  }


  removeUseCase(index: number) {
    this.useCases.removeAt(index)
  }

  removeProperty(index: number) {
    this.properties.removeAt(index)
  }

  async sendDataToDB() {
    await this.addScreenshotsToDB()
    let data = new FormModel(this.surveyForm.value as Partial<TableRow>)
    try {
      this.db.isRowAdded = await this.db.addRow(data)
      if (this.db.checkDBHandling()) {
        this.refreshComponent()
      }
    } catch (error) {
      console.log(error);

    }
  }

  refreshComponent() {
    window.location.reload()
  }
}
