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

  isActiveSession = signal(false)
  signInStatus: 'logged in' | 'logged out' = 'logged out';
  tokenTimestamp: number = 0
  currentTimestamp: number = Math.floor(Date.now() / 1000)
  token = this.local.getItem(this.key.token)
  isTokenExpired = false

  async sendCredentials(email: AbstractControl<string | null, string | null, any> | null, password: AbstractControl<string | null, string | null, any> | null) {
    let session = await this.auth.signInWithEmail(email, password)
    this.isActiveSession.set(this.getActiveSession(session))
  }

  getActiveSession(session: string | false): boolean {
    if (!session) {
      this.signInStatus = 'logged out'
      return false
    } else {
      this.signInStatus = 'logged in'
      return true
    }
  }


  ngOnInit() {
    this.readAccesToken()
  }

  readAccesToken(){
    if (this.token) {
      let json = this.local.parseJSON(this.token)
      this.tokenTimestamp = json.expires_at
      this.isTokenExpired = this.currentTimestamp - this.tokenTimestamp < 0
      if (this.isTokenExpired) {
        this.setActiveUserSession()
      } else this.unsetActiveUserSession()
    }
  }


  setActiveUserSession() {
    this.isActiveSession.set(true)
    this.signInStatus = 'logged in'
  }

  unsetActiveUserSession() {
    this.local.deleteLocalStorage(this.key.token)
    this.isActiveSession.set(false)
    this.signInStatus = 'logged out'
  }

  get email() {
    return this.form.signInForm.get('email')
  }

  get password() {
    return this.form.signInForm.get('password')
  }
}
