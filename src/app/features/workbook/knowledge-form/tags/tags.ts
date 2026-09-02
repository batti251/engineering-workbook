import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { afterRenderEffect, Component, computed, effect, EventEmitter, inject, Input, Output, signal, viewChild } from '@angular/core';
import { Supabase } from '../../../../core/db';
import { OverlayModule } from '@angular/cdk/overlay';
import { tags } from '../../../../shared/interfaces/knowledge-entry-data';

@Component({
  selector: 'app-tags',
  imports: [Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option, OverlayModule],
  templateUrl: './tags.html',
  styleUrl: './tags.scss',
})
export class Tags {
  db = inject(Supabase)

  @Output() newTag = new EventEmitter<string[]>()
  @Input() renderedTags: string[] = [];

  /** The options available in the listbox. */
  selectedValues = signal<string[]>([]);

  /** The labels that are available for selection. */
  labels = signal<tags[]>([]);

/** The combobox listbox popup. */
  readonly listbox = viewChild(Listbox);

  /** The string that is displayed in the combobox. */
  readonly displayValue = computed(() => {
    const values = this.selectedValues();
    if (values.length === 0) {
      return 'Select a label';
    }
    if (values.length === 1) {
      return values[0];
    }
    return `${values[0]} + ${values.length - 1} more`;
  });

  /**
   * emits selected Tags-Array to form-component
   * @param tag - list of tags
   * @returns 
   */
  addNewItems(tags: string[]): string[] | void {
    return this.newTag.emit(tags)
  }

  async ngOnInit() {
    this.setTagsFromDb();
  }
  /** Whether the popup is expanded. */
  readonly popupExpanded = signal(false);
  constructor() {

    // Scrolls to the active item when the active option changes.
    afterRenderEffect(() => {
      this.listbox()?.scrollActiveItemIntoView();
    });

    effect(() => {
      const values = this.selectedValues();
      if (this.selectedValues().length == 0) {
        return
      }
      this.addNewItems(values);

    })
  }

  /**
   * Reads tags_table and set it to the label-signal
   * preselect tags, when entering edit-form
   */
  async setTagsFromDb() {
    let tagsTable = await this.db.readDbTable('tags') as tags[]
    if (tagsTable) {
      this.labels.set(tagsTable)
    }
    this.selectedValues.set(this.renderedTags);
  }

}
