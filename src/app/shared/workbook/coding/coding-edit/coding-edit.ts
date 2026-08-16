import { Component, inject, input, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TableRow } from '../../../interfaces/table-row';
import { FormModel } from '../../../models/form-model';
import { Supabase } from '../../../services/supabase';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Clipboard } from '../../../services/clipboard';

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
  clipboard = inject(Clipboard)
  private formBuilder = inject(FormBuilder);

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
      this.db.tempDBFiles.push(file)
    })
    this.patchEditForm();
    this.setOptionalFormControls();

    console.log(this.db.tempDBFiles);
    
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


  /**
   * Clears the temporary files-Array
   * Emits emptyData value to parent component
   * @param value - null value
   */
  cancelInput(value: null) {
    this.emptyData.emit(value)
    this.clipboard.files = []
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
   * 
   */
  async addScreenshotsToDB() {
    for (const file of this.clipboard.files) {
     let screenshotURL =  await this.db.addScrenshot(this.screenshots, file)
     this.screenshots.push(this.formBuilder.control(screenshotURL))
    }
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
    console.log(this.db.tempDBFiles);
    this.screenshots.removeAt(index)
    this.db.toDeleteDBFiles.push(this.db.tempDBFiles[index])
    this.db.tempDBFiles.splice(index, 1)
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
      this.db.isRowUpdated = await this.db.updateRow(editedData)
      this.db.isFileDeleted = await this.db.deleteFile(this.db.toDeleteDBFiles)
       if (this.db.checkDBHandling()) {
        this.refreshComponent()
      } 
    } catch (error) {
      console.log(error);
      return
    }
  }


    refreshComponent() {
    window.location.reload()
  }
}
