import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Forms } from '../../services/forms';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Keys } from '../../services/key';
import { LocalStorage } from '../../services/local-storage';

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
      let session = await this.auth.signInWithEmail(email, password)
      console.log(session);
    } catch (error) {
      console.log(error);
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
