import { Component, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, FormArray, FormBuilder, Validators, Form} from '@angular/forms';

@Component({
  selector: 'app-coding',
  imports: [],
  templateUrl: './coding.html',
  styleUrl: './coding.scss',
})
export class Coding {
  private formBuilder = inject(FormBuilder)
  form = this.formBuilder.group({
    language: ['', Validators.required],
    area: ['', Validators.required],
    methodFor: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    returnValue:  ['', Validators.required],
    useCases :  this.formBuilder.array([this.formBuilder.control('')])
  })


  get useCases(){
    return this.form.controls.useCases as FormArray
  }

  addUseCase(){
    this.useCases.push(this.formBuilder.control(''))
  }
}
