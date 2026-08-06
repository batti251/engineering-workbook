import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  Validators,
  Form,
} from '@angular/forms';
import { Supabase } from '../../services/supabase';
import { FormModel } from '../../models/form-model'; 
import { TableRow } from '../../interfaces/table-row';

@Component({
  selector: 'app-coding',
  imports: [ReactiveFormsModule],
  templateUrl: './coding.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './coding.scss',
})
export class Coding {
  private db = inject(Supabase)
  private formBuilder = inject(FormBuilder);
  surveyForm = this.formBuilder.group({
    language: ['Python', Validators.required],
    title: ['string code', Validators.required],
    description: ['here is some description', Validators.required],
    syntax: ['str()', Validators.required],
    returnValue: ['returns a new String', Validators.required],
    useCases: this.formBuilder.array([this.formBuilder.control('')]),
  });

  ngOnInit(){
    this.db.readDB()
  }

  get useCases() {
    return this.surveyForm.controls.useCases as FormArray;
  }

  addUseCase() {
    this.useCases.push(this.formBuilder.control(''));
  }

  sendDataToDB(){
    let data = new FormModel(this.surveyForm.value as Partial<TableRow>)
    this.db.addRow(data)
  }
}
