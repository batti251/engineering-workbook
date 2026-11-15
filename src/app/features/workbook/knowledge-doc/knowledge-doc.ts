import { Component, inject, signal } from '@angular/core';
import { KnowledgeEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { RouterLink } from '@angular/router';
import { Toolbar } from './toolbar/toolbar';
import { Filter } from './filter';

@Component({
  selector: 'app-coding-doc',
  imports: [RouterLink, Toolbar],
  templateUrl: './knowledge-doc.html',
  styleUrl: './knowledge-doc.scss',
})
export class KnowledgeDoc {
  readonly filterService = inject(Filter)
  readonly filteredItems = signal<KnowledgeEntryData[]>([])
}
