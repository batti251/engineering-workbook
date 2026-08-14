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
   private db = inject(Supabase)
  private formBuilder = inject(FormBuilder);
  surveyForm = this.formBuilder.group({
    language: ['Python', Validators.required],
    description: ['here is some description', Validators.required],
    syntax: ['str()', Validators.required],
    return_value: ['returns a new String', Validators.required],
    properties: this.formBuilder.array([this.formBuilder.control('')]),
    use_cases: this.formBuilder.array([this.formBuilder.control('')]),
  });

  ngOnInit(){
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

  sendDataToDB(){
    let data = new FormModel(this.surveyForm.value as Partial<TableRow>)
    /* this.db.addRow(data) */

    console.log(data);
    
  }
}
