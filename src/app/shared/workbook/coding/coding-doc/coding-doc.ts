import { Component, inject, output, signal } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { TableRow } from '../../../interfaces/table-row';
import { JsonPipe } from '@angular/common';
import { CodingEdit } from '../coding-edit/coding-edit';
import { FormModel } from '../../../models/form-model';

@Component({
  selector: 'app-coding-doc',
  imports: [JsonPipe, CodingEdit],
  templateUrl: './coding-doc.html',
  styleUrl: './coding-doc.scss',
})
export class CodingDoc {
  x = signal<TableRow[]>([{
    language: "",
    description: "",
    syntax: "",
    return_value: "",
    properties: [],
    use_cases: [],
    screenshots: []
  }])
  db = inject(Supabase)
  selectItem: TableRow | null = null

  clearSelectItem(emptyData: null) {
    this.selectItem = emptyData
  }

  async ngOnInit() {
    await this.readDB()
  }

  async readDB() {
    let database = await this.db.readDB() as TableRow[]
    if (database.length > 0) {
      this.x.set(database)
    }
  }


  updateRow(data: TableRow) {
    this.selectItem = data
  }
}
