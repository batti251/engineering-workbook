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

  private db = inject(Supabase)
  private formBuilder = inject(FormBuilder);

  surveyEditForm = this.formBuilder.group({
    id: 0,
    language: ['', Validators.required],
    description: ['', Validators.required],
    syntax: ['', Validators.required],
    return_value: ['', Validators.required],
    properties: this.formBuilder?.array([]),
    use_cases: this.formBuilder?.array([]),
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
    })
  }

  setOptionalFormControls() {
    this.data().properties?.forEach(property => {
      this.properties.push(this.formBuilder.control(property))
    }) 

    this.data().use_cases?.forEach(useCase => {
      this.useCases.push(this.formBuilder.control(useCase)) 
    })
  }

  get useCases() {
    return this.surveyEditForm.get('use_cases') as FormArray;
  }

  get properties() {
    return this.surveyEditForm.get('properties') as FormArray;
  }

  addProperty() {
    return this.data()?.properties?.forEach(property => {
      this.properties.push(property);
    })
  }

  addUseCase() {
    this.useCases.push(this.formBuilder.control(''));
  }

  updateRow() {
    let editedData = new FormModel(this.surveyEditForm.value as TableRow)  
    this.db.updateRow(editedData )
  }
}
