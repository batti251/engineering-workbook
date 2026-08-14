import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Coding } from './shared/workbook/coding/coding';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Coding],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('engineering-workbook');
}
