import { Component, input, inject } from '@angular/core';
import { TableRow } from '../../../../interfaces/table-row';
import { Supabase } from '../../../../services/supabase';
import { CodingEdit } from '../../coding-edit/coding-edit';

@Component({
  selector: 'app-python',
  imports: [CodingEdit],
  templateUrl: './python.html',
  styleUrl: './python.scss',
})
export class Python {
  data = input<TableRow[]>()
  db = inject(Supabase)

  ngOnInit(){
    console.log(this.data());
    
  }
  
  selectItem: TableRow | null = null
  clearSelectItem(emptyData: null) {
    this.selectItem = emptyData
  }

    updateRow(data: TableRow) {
    this.selectItem = data
  }
}
