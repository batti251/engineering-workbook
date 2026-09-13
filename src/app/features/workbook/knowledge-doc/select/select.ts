import { afterRenderEffect, Component, computed, output, signal, viewChild, inject, effect } from '@angular/core';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { Supabase } from '../../../../core/db';
import { tags } from '../../../../shared/interfaces/knowledge-entry-data';
import { LocalStorage } from '../../../../core/local-storage';

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  styleUrl: './select.scss',
  imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option, OverlayModule],
})

export class Select {
  private db = inject(Supabase)
  private local = inject(LocalStorage)
  readonly selectedValue = output<string[]>()
  readonly listbox = viewChild(Listbox);
  readonly selectedValues = signal<string[]>(this.local.getActiveTag());
  readonly displayValue = computed(() => this.selectedValues()[0] || 'Filter Topic');
  readonly popupExpanded = signal(false);
  labels: string[] = [];

  constructor() {
    afterRenderEffect(() => {
      this.listbox()?.scrollActiveItemIntoView();
    });
    effect(() => {
      localStorage.setItem('activeTag', this.selectedValues()[0])
    })
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
