import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TableRow } from '../../../interfaces/table-row';
import { FormModel } from '../../../models/form-model';
import { Supabase } from '../../../services/supabase';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-coding-edit',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './coding-edit.html',
  styleUrl: './coding-edit.scss',
})
export class CodingEdit {
  data = input.required<TableRow>()

  db = inject(Supabase)
  private formBuilder = inject(FormBuilder);
  private files: File[] = []

  surveyEditForm = this.formBuilder.group({
    id: 0,
    language: ['', Validators.required],
    description: ['', Validators.required],
    syntax: ['', Validators.required],
    return_value: ['', Validators.required],
    properties: this.formBuilder?.array([]),
    use_cases: this.formBuilder?.array([]),
    screenshots: this.formBuilder?.array([]),
  });

  ngOnInit() {
    if (!this.data()) return
    this.patchEditForm();
    this.setOptionalFormControls();
  }

  patchEditForm() {
    this.surveyEditForm.patchValue({
      id: this.data().id,
      language: this.data().language,
      description: this.data().description,
      syntax: this.data().syntax,
      return_value: this.data().return_value,
      screenshots: this.data().screenshots
    })
  }

  setOptionalFormControls() {
    this.data().properties?.forEach(property => {
      this.properties.push(this.formBuilder.control(property))
    })

    this.data().use_cases?.forEach(useCase => {
      this.useCases.push(this.formBuilder.control(useCase))
    })

    this.data().screenshots?.forEach(screenshot => {
      this.screenshots.push(this.formBuilder.control(screenshot))
    })

  }

  get useCases() {
    return this.surveyEditForm.get('use_cases') as FormArray;
  }

  get properties() {
    return this.surveyEditForm.get('properties') as FormArray;
  }

  get screenshots() {
    return this.surveyEditForm.get('screenshots') as FormArray;
  }

  /**
   * Adds new form-control to surveyEditForm.properties-FormArray
   * @returns 
   */
  addProperty() {
    return this.data()?.properties?.forEach(property => {
      this.properties.push(property);
    })
  }

  /**
   * Adds new form-control to surveyEditForm.useCases-FormArray
   */
  addUseCase() {
    this.useCases.push(this.formBuilder.control(''));
  }


/**
 * Adds new form-control to surveyEditForm.screenshots-FormArray
 * Receives storaged-path by returned path from {@linkdb.uploadFile()}
 * @param formArray 
 * @param file 
 */
  async addScrenshot(formArray: FormArray, file: File) {
    try {
      const path = await this.db.uploadFile(file)
      if (path) {
        formArray.push(this.formBuilder.control(path.path))
      }
    } catch (error) {
      console.log(error);
    }
  }


  /**
   * 
   */
  async addScreenshotsToDB() {
    for (const file of this.files) {
      await this.addScrenshot(this.screenshots, file)
    }
  }

  async updateRow() {
    await this.addScreenshotsToDB()
    let editedData = new FormModel(this.surveyEditForm.value as TableRow)
    await this.db.updateRow(editedData)
  }

  /**
   * Stores temporary screenshot file in files-Array
   * @param event - the paste-event triggered by the user
   * @returns 
   */
  async addTempScreenshot(event: ClipboardEvent) {
    let data = event.clipboardData?.items
    if (!data) return
    for (const item of data) {
      let file = item.getAsFile()
      if (!file) return
      this.files.push(file)
      break;
    }
  }

}
