import { Component, inject, signal } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { TableRow } from '../../../interfaces/table-row';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-coding-doc',
  imports: [JsonPipe],
  templateUrl: './coding-doc.html',
  styleUrl: './coding-doc.scss',
})
export class CodingDoc {
  x = signal<TableRow[]>([{
    language: "",
    title: "",
    description: "",
    syntax: "",
    return_value: "",
    use_cases: []
  }])
  db = inject(Supabase)


  async ngOnInit() {
    await this.readDB()
  }

  async readDB() {
    let database = await this.db.readDB()
    if (database) {
      this.x.set(database)
    }
  }
}
