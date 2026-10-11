import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Auth } from '../../core/auth';
import { User } from './user-signup-interface';

@Component({
  selector: 'app-user-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './user-signup.html',
  styleUrl: './user-signup.scss',
})


export class UserSignup {
  private formBuilder = inject(FormBuilder)
  private auth = inject(Auth)
  error = signal('')
  signUpSuccess = signal(false);
  newUserData = signal<User>(
    {
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      password: 'string',
      passwordConfirm: 'string'
    }
  )

  userSignup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(8), this.matchedPasswords('password')]],
  })



  sendNewUser() {
    this.checkFieldsRequired()
    if (this.signUpSuccess()) {
      this.auth.signUpUser(this.newUserData().email, this.newUserData().password)
      console.log(this.userSignup.value);
    }
  }



  checkFieldsRequired() {
    if (this.userSignup.invalid) {
      let invalidInput = document.querySelectorAll('.ng-invalid')[1]
      let errorInput = this.userSignup.get(invalidInput.id)

      switch (true) {
        case errorInput?.hasError('required'):
          this.setMessage('required')
          break;
        case errorInput?.hasError('minlength'):
          this.setMessage('minlength')
          break;
        case errorInput?.hasError('email'):
          this.setMessage('email')
          break;
        case errorInput?.hasError('missmatch'):
          this.setMessage('missmatch')
          break;
        default:
          break;
      }
      this.signUpSuccess.update(() => false)
      return
    }
    this.signUpSuccess.update(() => true)
    return this.newUserData.update(() => this.userSignup.value as User)
  }

  setMessage(error: string) {
    type errorMessages =
      "Dieses Feld darf nicht leer sein" |
      "Das Passwort muss mindestens 8 Zeichen lang sein" |
      "Kein gültiges E-Mail-Format" |
      "Die Passwörter stimmen nicht überein"

    const errors: Record<string, errorMessages> = {
      required: "Dieses Feld darf nicht leer sein",
      minlength: "Das Passwort muss mindestens 8 Zeichen lang sein",
      email: "Kein gültiges E-Mail-Format",
      missmatch: "Die Passwörter stimmen nicht überein"
    }

    const errorSpan = document.querySelector('.error:not(.hide)') as HTMLSpanElement;
    this.error.update(() => errors[error])
    errorSpan?.classList.add('show')
  }


  matchedPasswords(password: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.parent?.get(password)
      if (passwordControl?.value === control.value) {
        return null
      } else {
        return { missmatch: true }
      }
    }
  }
}

