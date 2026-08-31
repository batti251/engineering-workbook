import { inject, Service, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { Keys } from '../shared/services/key';
import { AbstractControl } from '@angular/forms';
import { LocalStorage } from './local-storage';
import { Supabase } from './db';

@Service()
export class Auth {
  private key = inject(Keys)
  private local = inject(LocalStorage)
  private db = inject(Supabase).db
  
  isActiveSession = signal(false)
  token = this.local.getItem(this.key.token)
  tokenTimestamp: number = 0
  currentTimestamp: number = Math.floor(Date.now() / 1000)
  isTokenExpired = false

  async signInWithEmail(email: AbstractControl<string | null, string | null, any> | null, password: AbstractControl<string | null, string | null, any> | null) {
    const { data, error } = await this.db.auth.signInWithPassword({
      email: email?.value ?? '',
      password: password?.value ?? '',
    })
    if (data.session) {
      this.isActiveSession.update(() => true)
      return data.session.access_token
    } else {
      this.isActiveSession.update(() => false)
      return false
    }
  }

  readAccesToken() {
    if (this.token) {
      let json = this.local.parseJSON(this.token);
      this.tokenTimestamp = json.expires_at;
      this.isTokenExpired = this.currentTimestamp - this.tokenTimestamp < 0
      if (this.isTokenExpired) {
        this.isActiveSession.update(() => true)
      } else {
        this.local.deleteLocalStorage(this.key.token);
        this.isActiveSession.update(() => false);
      }
    } 
  }
}


