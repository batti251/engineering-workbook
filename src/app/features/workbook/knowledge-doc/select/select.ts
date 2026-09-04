import { afterRenderEffect, Component, computed, output, signal, viewChild, inject } from '@angular/core';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { Supabase } from '../../../../core/db';
import { tags } from '../../../../shared/interfaces/knowledge-entry-data';

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  styleUrl: './select.scss',
  imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option, OverlayModule],
})

export class Select {
  private db = inject(Supabase)
  readonly selectedValue = output<string[]>()
  readonly listbox = viewChild(Listbox);
  readonly selectedValues = signal<string[]>([]);
  readonly displayValue = computed(() => this.selectedValues()[0] || 'Select a label');
  readonly popupExpanded = signal(false);
  labels: string[] = [];



  constructor() {
    afterRenderEffect(() => {
      this.listbox()?.scrollActiveItemIntoView();
    });
  }

  async ngOnInit() {
    await this.getAllTagsFromDB();
  }

  async getAllTagsFromDB() {
    let getTags = await this.db.readDbTable('tags') as tags[];
    getTags.forEach((tag) => {
      this.labels.push(tag.tag)
    })
  }

  onCommit() {
    this.popupExpanded.set(false);
    this.selectedValue.emit(this.selectedValues())
  }
}
