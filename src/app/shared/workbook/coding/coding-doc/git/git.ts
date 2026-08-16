import { Component, input } from '@angular/core';
import { TableRow } from '../../../../interfaces/table-row';
@Component({
  selector: 'app-git',
  imports: [],
  templateUrl: './git.html',
  styleUrl: './git.scss',
})
export class Git {

  data = input<TableRow[]>()  

}
