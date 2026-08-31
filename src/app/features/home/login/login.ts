import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../../core/auth';
import { Forms } from '../../../shared/services/forms';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Keys } from '../../../shared/services/key';
import { LocalStorage } from '../../../core/local-storage';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form = inject(Forms)
  auth = inject(Auth)
  key = inject(Keys)
  local = inject(LocalStorage)


  async sendCredentials(email: AbstractControl<string | null, string | null, any> | null, password: AbstractControl<string | null, string | null, any> | null) {
    try {
      await this.auth.signInWithEmail(email, password)
    } catch (error) {
    }

  }


  ngOnInit() {
    this.auth.readAccesToken()
  }


  get email() {
    return this.form.signInForm.get('email')
  }

  get password() {
    return this.form.signInForm.get('password')
  }
}
