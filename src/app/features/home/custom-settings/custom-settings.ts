import { Component, effect, inject, signal } from '@angular/core';
import { Supabase } from '../../../core/db';
import { tags } from '../../../shared/interfaces/knowledge-entry-data';
import { LocalStorage } from '../../../core/local-storage';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { Tags } from './tags/tags';

@Component({
  selector: 'app-custom-settings',
  imports: [ReactiveFormsModule, Tags],
  templateUrl: './custom-settings.html',
  styleUrl: './custom-settings.scss',
})
export class CustomSettings {
  auth = inject(Auth)
  signInStatus = signal<'logged in' | 'logged out'>('logged out');

  constructor() {
    effect(() => {
      this.listenToActiveSession()
      this.auth.isActiveSession()
    }
    )
  }


  listenToActiveSession() {
    if (this.auth.isActiveSession()) {
      this.signInStatus.update(() => 'logged in')
    } else this.signInStatus.update(() => 'logged out')
  }


  async triggerLogout() {
    if (await this.auth.logoutUser() === null) {
      window.location.replace('home')
    }
  }
}
