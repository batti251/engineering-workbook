import { Component, computed, EventEmitter, inject, Output, OutputEmitterRef, signal } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { TableRow } from '../../../interfaces/table-row';
import { JsonPipe } from '@angular/common';
import { CodingEdit } from '../coding-edit/coding-edit';
import { Git } from './git/git';
import { Select } from '../../../components/select/select/select';
@Component({
  selector: 'app-coding-doc',
  imports: [JsonPipe, CodingEdit, Git, Select],
  templateUrl: './coding-doc.html',
  styleUrl: './coding-doc.scss',
})
export class CodingDoc {
  db = inject(Supabase)
  selectedValue: string[] = []
  datas = signal<TableRow[]>([{
    language: "",
    description: "",
    syntax: "",
    return_value: "",
    properties: [],
    use_cases: [],
    screenshots: []
  }])
  selectItem: TableRow | null = null
  filteredItems = signal<TableRow[]>([{
    language: "",
    description: "",
    syntax: "",
    return_value: "",
    properties: [],
    use_cases: [],
    screenshots: []
  }])

  clearSelectItem(emptyData: null) {
    this.selectItem = emptyData
  }

  getSelectedValue(value: string[]) {
    this.filterDatas(value[0])
  }

  filterDatas(value: string) {
    this.filteredItems.update(() => this.datas().filter((entry) => {
     return entry.language == value
    }))
  }

  async ngOnInit() {
    await this.readDB()
  }


  async readDB() {
    let database = await this.db.readDB() as TableRow[]
    if (database.length > 0) {
      this.datas.set(database)
      this.filteredItems.set(database)
    }
  }


  updateRow(data: TableRow) {
    this.selectItem = data
  }
}
