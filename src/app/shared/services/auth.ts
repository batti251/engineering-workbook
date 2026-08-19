import { inject, Service } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { Keys } from './key';
import { AbstractControl } from '@angular/forms';

@Service()
export class Auth {
  key = inject(Keys)
  supabase = createClient(this.key.supabaseURL, this.key.supabaseKey)

  async signInWithEmail(email: AbstractControl<string | null, string | null, any> | null, password: AbstractControl<string | null, string | null, any> | null) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email?.value ?? '',
      password: password?.value ?? '',
    })
    if (data.session) {
      return data.session.access_token
    } else return false
  }
}


