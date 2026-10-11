import { Component, effect, inject, signal } from '@angular/core';
import { Login } from "./login/login";
import { Auth } from '../../core/auth';
import { ToDo } from './to-do/to-do';
import { CustomSettings } from './custom-settings/custom-settings';
import { UserSignup } from '../user-signup/user-signup';

@Component({
  selector: 'app-home',
  imports: [Login, ToDo, CustomSettings, UserSignup],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  auth = inject(Auth)

}
