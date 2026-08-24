import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { Supabase } from '../../../../core/supabase';
import { KnowledgeEntryData } from '../../../../shared/interfaces/knowledge-entry-data';
import { JsonPipe } from '@angular/common';
import { Git } from './git/git';
import { Python } from './python/python';
import { Select } from '../../../../shared/components/select/select';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-coding-doc',
  imports: [JsonPipe, RouterLink, Git, Python, Select],
  templateUrl: './coding-doc.html',
  styleUrl: './coding-doc.scss',
})
export class CodingDoc {
  db = inject(Supabase)
  selectedValue: string = 'Python'
  datas = signal<KnowledgeEntryData[]>([{
    language: "",
    description: "",
    syntax: "",
    return_value: "",
    properties: [],
    use_cases: [],
    screenshots: []
  }])
  
  filteredItems = signal<KnowledgeEntryData[]>([{
    language: "",
    description: "",
    syntax: "",
    return_value: "",
    properties: [],
    use_cases: [],
    screenshots: []
  }])



  getSelectedValue(value: string[]) {
    console.log(value[0]);
    
    this.filterDatas(value[0])
    console.log(this.filterDatas(value[0]));
    
  }

  filterDatas(value: string) {
    this.filteredItems.update(() => this.datas().filter((entry) => {
     return entry.language == value
    }))
    console.log(this.selectedValue);
    this.selectedValue = value
    console.log(this.filteredItems());
    
  }

  async ngOnInit() {
    await this.readDB()
    console.log(this.datas());
    console.log(this.filteredItems());
    
  }


  async readDB() {
    let database = await this.db.readDB() as KnowledgeEntryData[]
    if (database.length > 0) {
      this.datas.set(database)
      this.filteredItems.set(database)
    }
  }



}
