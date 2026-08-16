import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TableRow } from '../../../interfaces/table-row';
import { FormModel } from '../../../models/form-model';
import { Supabase } from '../../../services/supabase';
import { Clipboard } from '../../../services/clipboard';

@Component({
  selector: 'app-coding-add',
  imports: [ReactiveFormsModule],
  templateUrl: './coding-add.html',
  styleUrl: './coding-add.scss',
})
export class CodingAdd {
  db = inject(Supabase)
  clipboard = inject(Clipboard)
  files: File[] = []
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
    for (const file of this.clipboard.files) {
      await this.addScrenshot(this.screenshots, file)
    }
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
      let isRowAdded = await this.db.addRow(data)
      if (this.checkDBHandling(isRowAdded,true)) {
        this.refreshComponent()
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  refreshComponent() {
    window.location.reload()
  }


    checkDBHandling(isRowUpdated:boolean, isFileDeleted:boolean){
    if (isRowUpdated && isFileDeleted) {
       return true
      } else return false
  }
}
