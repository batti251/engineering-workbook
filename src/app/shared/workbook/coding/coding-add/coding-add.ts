import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TableRow } from '../../../interfaces/table-row';
import { FormModel } from '../../../models/form-model';
import { Supabase } from '../../../services/supabase';

@Component({
  selector: 'app-coding-add',
  imports: [ReactiveFormsModule],
  templateUrl: './coding-add.html',
  styleUrl: './coding-add.scss',
})
export class CodingAdd {
  db = inject(Supabase)
  files: File[] = []
  tempFiles: string[] = []
  private formBuilder = inject(FormBuilder);
  surveyForm = this.formBuilder.group({
    language: ['Python', Validators.required],
    description: ['here is some description', Validators.required],
    syntax: ['str()', Validators.required],
    return_value: ['returns a new String', Validators.required],
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
   * Adds new form-control to surveyEditForm.screenshots-FormArray
   * Receives storaged-path by returned path from {@linkdb.uploadFile()}
   * @param formArray 
   * @param file 
   */
  async addScrenshot(formArray: FormArray, file: File) {
    console.log(formArray);

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
      this.createTempBlobURL(file)
      this.files.push(file)
      break;
    }
  }

  /**
   * creates temporary blob-url and stores it into temporary Arraay
   * @param file - the screenshot-file
   */
  createTempBlobURL(file: File) {
    let tempURL = URL.createObjectURL(file)
    this.tempFiles.push(tempURL)
  }

  showDeleteBtn = false
  hoveredBlob: string = ''
  /**
   * toggles hover-states to add delete-hover-effect over images
   * @param indexUseCase 
   */
  toggleDeleteBtn(indexUseCase: string) {
    console.log(indexUseCase);
    if (!this.showDeleteBtn) {
      this.hoveredBlob = indexUseCase
      this.showDeleteBtn = true
    } else if (this.showDeleteBtn) {
      this.showDeleteBtn = false
      this.hoveredBlob = ''
    }
  }

  /**
   * removes indexed screenshot-url from temporary Array
   * @param index 
   */
  removeTempScreenshot(index: number) {
    this.tempFiles.splice(index, 1)
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
    this.db.addRow(data)
  }
}
