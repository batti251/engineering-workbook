import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { Supabase } from '../../../core/db';
import { KnowledgeEntryData, KnowledgeSubEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { JsonPipe } from '@angular/common';
import { Select } from '../../../shared/components/select/select';
import { RouterLink } from '@angular/router';
import { Keys } from '../../../shared/services/key';

@Component({
  selector: 'app-coding-doc',
  imports: [JsonPipe, RouterLink, Select],
  templateUrl: './knowledge-doc.html',
  styleUrl: './knowledge-doc.scss',
})
export class KnowledgeDoc {
  db = inject(Supabase)
  selectedValue: string = 'Python'
  key = inject(Keys)
  storageImgPath = this.key.dbURL+'/'+ this.key.dbStorage + '/' + this.key.ImgStore

    subEnt = signal<KnowledgeSubEntryData[]>([{
    subTitle: '',
    description: '',
    details: [],
    screenshots: [],
    externalLinks: []
  }])


  datas = signal<KnowledgeEntryData[]>([{
    title: "",
    description: "",
    tags: [],
    image: '',
    subEntries: this.subEnt()
  }])

  filteredItems = signal<KnowledgeEntryData[]>([{
    title: "",
    description: "",
    tags: [],
    image: '',
    subEntries: this.subEnt()
  }])


  getSelectedValue(value: string[]) {
    console.log(value[0]);

    this.filterDatas(value[0])
    console.log(this.filterDatas(value[0]));

  }

  filterDatas(value: string) {
  /*   this.filteredItems.update(() => this.datas().filter((entry) => {
      return entry.language == value
    }))
    console.log(this.selectedValue);
    this.selectedValue = value
    console.log(this.filteredItems()); */

  }

  async ngOnInit() {
    await this.readKnowledgeEntries()
    console.log(this.datas());
    console.log(this.filteredItems());

  }

  async readKnowledgeEntries() {
    let database = await this.db.readKnowledgeEntries() as KnowledgeEntryData[]
    if (database.length > 0) {
      this.datas.set(database)
      this.filteredItems.set(database)
    }
  }



}
