import { Component, effect, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  signInStatus = signal<'logged in' | 'logged out'>('logged out');
  auth = inject(Auth)

  constructor() {
    effect(() => {
      this.listenToActiveSession()
    }
    )
  }


  listenToActiveSession() {
    if (this.auth.isActiveSession()) {
      this.signInStatus.update(() => 'logged in')
    } else this.signInStatus.update(() => 'logged out')
  }
}
