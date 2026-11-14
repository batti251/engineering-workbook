import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Select } from '../select/select';
import { KnowledgeEntryData } from '../../../../shared/interfaces/knowledge-entry-data';
import { Filter } from '../filter';

@Component({
  imports: [Select, RouterLink],
  selector: 'app-toolbar',
  styleUrl: './toolbar.scss',
  templateUrl: './toolbar.html',
})
export class Toolbar {
  readonly filteredItems = signal<KnowledgeEntryData[]>([])
  readonly filterService = inject(Filter)
  selectedValue: string = ''
}
