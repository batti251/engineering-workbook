import { Component, effect, inject, signal } from '@angular/core';
import { Auth } from '../../core/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  signInStatus = signal<'logged in' | 'logged out'>('logged out');
  auth = inject(Auth)
  route = inject(Router)

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
