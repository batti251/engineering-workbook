import { Component, input } from '@angular/core';
import { KnowledgeEntryData } from '../../../../../shared/interfaces/knowledge-entry-data';
@Component({
  selector: 'app-git',
  imports: [],
  templateUrl: './git.html',
  styleUrl: './git.scss',
})
export class Git {

  data = input<KnowledgeEntryData[]>()  

}
