import { Component, input, inject } from '@angular/core';
import { KnowledgeEntryData } from '../../../../../shared/interfaces/knowledge-entry-data';
import { Supabase } from '../../../../../core/supabase';
import { CodingEdit } from '../../coding-edit/coding-edit';

@Component({
  selector: 'app-python',
  imports: [CodingEdit],
  templateUrl: './python.html',
  styleUrl: './python.scss',
})
export class Python {
  data = input<KnowledgeEntryData[]>()
  db = inject(Supabase)

  ngOnInit(){
    console.log(this.data());
    
  }
  
  selectItem: KnowledgeEntryData | null = null
  clearSelectItem(emptyData: null) {
    this.selectItem = emptyData
  }

    updateRow(data: KnowledgeEntryData) {
    this.selectItem = data
  }
}
