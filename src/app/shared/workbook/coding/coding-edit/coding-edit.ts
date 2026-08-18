import { Component, inject, input, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TableRow } from '../../../interfaces/table-row';
import { FormModel } from '../../../models/form-model';
import { Supabase } from '../../../services/supabase';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Clipboard } from '../../../services/clipboard';
import { Forms } from '../../../services/forms';
import { ScreenshotUploadArea } from "../../../components/screenshot-upload-area/screenshot-upload-area";
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-coding-edit',
  imports: [ReactiveFormsModule, JsonPipe, ScreenshotUploadArea],
  templateUrl: './coding-edit.html',
  styleUrl: './coding-edit.scss',
})
export class CodingEdit {
  data = input.required<TableRow>()
  @Output() emptyData = new EventEmitter<null>();
  router = inject(Router)
  db = inject(Supabase)
  clipboard = inject(Clipboard)
  forms = inject(Forms)


  ngOnInit() {
    this.resetPreviousFormControls();
    this.setTempDBFiles();
    this.getCurrentFormControls();
  }

  resetPreviousFormControls() {
    this.forms.resetFormEditArrays(this.forms.surveyForm.controls.properties)
    this.forms.resetFormEditArrays(this.forms.surveyForm.controls.use_cases)
    this.forms.resetFormEditArrays(this.forms.surveyForm.controls.screenshots)
  }
  
  setTempDBFiles(){
    this.db.tempDBFiles = []
    if (!this.data()) return
    this.data()?.screenshots?.forEach(file => {
      this.db.tempDBFiles.push(file)
    })
  }

  getCurrentFormControls(){
    this.forms.patchEditForm(this.data());
    this.forms.setOptionalFormControls(this.data());
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

  async updateRow() {
    await this.forms.addScreenshotsToDB(true)
    let editedData = new FormModel(this.forms.surveyForm.value as TableRow)
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
