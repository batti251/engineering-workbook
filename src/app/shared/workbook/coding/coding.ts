import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-coding',
  imports: [RouterLink],
  templateUrl: './coding.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './coding.scss',
})
export class Coding {

}

