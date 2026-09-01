import { Component, effect, inject, signal } from '@angular/core';
import { Login } from "./login/login";
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-home',
  imports: [Login],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  auth = inject(Auth)

}
