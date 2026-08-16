import { Component, inject, input, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TableRow } from '../../../interfaces/table-row';
import { FormModel } from '../../../models/form-model';
import { Supabase } from '../../../services/supabase';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coding-edit',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './coding-edit.html',
  styleUrl: './coding-edit.scss',
})
export class CodingEdit {
  data = input.required<TableRow | null>()
  @Output() emptyData = new EventEmitter<null>();
  router = inject(Router)
  db = inject(Supabase)
  private formBuilder = inject(FormBuilder);
  private files: File[] = []
  tempFiles: string[] = []
  tempDBFiles: string[] = []
  toDeleteDBFiles: string[] = []

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
    this.data()?.screenshots?.forEach(file => {
      this.tempDBFiles.push(file)
    })
    this.patchEditForm();
    this.setOptionalFormControls();

    console.log(this.tempDBFiles);
    
  }

  async deleteEntry(id: any) {
    if (!Number(id.value)) {
      return
    }
    try {
      let deleteTrigger = await this.db.deleteRow(id.value)
      console.log(deleteTrigger);
      if (!deleteTrigger) {
        console.log(deleteTrigger);

        this.refreshComponent()
      }
    } catch (error) {

    }
  }

  refreshComponent() {
    window.location.reload()
  }

  /**
   * Clears the temporary files-Array
   * Emits emptyData value to parent component
   * @param value - null value
   */
  cancelInput(value: null) {
    this.emptyData.emit(value)
    this.files = []
  }

  patchEditForm() {
    this.surveyEditForm.patchValue({
      id: this.data()?.id,
      language: this.data()?.language,
      description: this.data()?.description,
      syntax: this.data()?.syntax,
      properties: this.data()?.properties,
      return_value: this.data()?.return_value,
      screenshots: this.data()?.screenshots
    })
  }

  setOptionalFormControls() {
    this.data()?.properties?.forEach(property => {
      this.properties.push(this.formBuilder.control(property))
    })

    this.data()?.use_cases?.forEach(useCase => {
      this.useCases.push(this.formBuilder.control(useCase))
    })

    this.data()?.screenshots?.forEach(screenshot => {
      this.screenshots.push(this.formBuilder.control(screenshot))
    })
  }


  
  get useCases() {
    return this.surveyEditForm.get('use_cases') as FormArray;
  }
  
  /**
   * Adds new form-control to surveyEditForm.useCases-FormArray
   */
  addUseCase() {
    this.useCases.push(this.formBuilder.control(''));
  }

  get properties() {
    return this.surveyEditForm.get('properties') as FormArray;
  }

    /**
   * Adds new form-control to surveyEditForm.properties-FormArray
   * @returns 
   */
  addProperty() {
    this.properties.push(this.formBuilder.control(''));
  }

  get screenshots() {
    return this.surveyEditForm.get('screenshots') as FormArray;
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
  removeTempDBScreenshot(index: number) {
    console.log(this.tempDBFiles);
    this.screenshots.removeAt(index)
    this.toDeleteDBFiles.push(this.tempDBFiles[index])
    this.tempDBFiles.splice(index, 1)
  }

  removeUseCase(index: number) {
    this.useCases.removeAt(index)
  }

  removeProperty(index: number) {
    this.properties.removeAt(index)
  }


  async updateRow() {
    await this.addScreenshotsToDB()
    let editedData = new FormModel(this.surveyEditForm.value as TableRow)
     try {
      let isRowUpdated = await this.db.updateRow(editedData)
      let isFileDeleted = await this.db.deleteFile(this.toDeleteDBFiles)
       if (this.checkDBHandling(isRowUpdated,isFileDeleted)) {
        console.log(this.checkDBHandling(isRowUpdated,isFileDeleted));
        
        this.refreshComponent()
      } 
    } catch (error) {
      console.log(error);
      return
    }
  }

  checkDBHandling(isRowUpdated:boolean, isFileDeleted:boolean){
    if (isRowUpdated && isFileDeleted) {
       return true
      } else return false
  }




}
