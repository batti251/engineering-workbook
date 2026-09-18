import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('engineering-workbook');
  isDocked = false

  /**
   * Receives EventEmitter from sidebar-app
   * toggles docked status for sidebar
   * When it's docked the sidebar is expanded
   * @param event 
   * @returns 
   */
  isDockedEvent(event:boolean):boolean{
    return this.isDocked = event
  }
}
