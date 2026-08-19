import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Forms } from '../../services/forms';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Keys } from '../../services/key';

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
  isActiveSession = signal(false)
  signInStatus: 'logged in' | 'logged out' = 'logged out';


  async sendCredentials(email: AbstractControl<string | null, string | null, any> | null, password: AbstractControl<string | null, string | null, any> | null) {
    let session = await this.auth.signInWithEmail(email, password)
    this.isActiveSession.set(this.getActiveSession(session))
  }

  getActiveSession(session: string | false):boolean {
    if (!session) {
      this.signInStatus = 'logged out'
      return false
    } else {
      this.signInStatus = 'logged in'
      return true
    }
  }


  ngOnInit() {
     let unixTimestamp = Math.floor(Date.now() / 1000)
     let tokenTimestamp:number
     let getToken = localStorage.getItem(this.key.token)
     if (getToken) {
       let json = JSON.parse(getToken)
       tokenTimestamp = json.expires_at
       if (unixTimestamp - tokenTimestamp < 0) {
         this.isActiveSession.set(true)
         this.signInStatus = 'logged in'
       } else this.signInStatus = 'logged out'
     }
  }

  get email() {
    return this.form.signInForm.get('email')
  }

  get password() {
    return this.form.signInForm.get('password')
  }
}
