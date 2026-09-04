import { afterRenderEffect, Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { Supabase } from '../../../core/db';
import { KnowledgeEntryData, KnowledgeSubEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { Select } from './select/select';
import { RouterLink } from '@angular/router';
import { Keys } from '../../../shared/services/key';
import { LowerCasePipe } from '@angular/common';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-sql';
@Component({
  selector: 'app-coding-doc',
  imports: [RouterLink, Select, LowerCasePipe],
  templateUrl: './knowledge-doc.html',
  styleUrl: './knowledge-doc.scss',
})
export class KnowledgeDoc {

  highlightSql(code: string): string {
    return Prism.highlight(
      code,
      Prism.languages['sql'],
      'sql'
    );
  }

  private db = inject(Supabase)
  selectedValue: string = ''
  private key = inject(Keys)
  readonly storageImgPath = this.key.dbURL + '/' + this.key.dbStorage + '/' + this.key.ImgStore

  private entryDatas = signal<KnowledgeEntryData[]>([])
  filteredItems = signal<KnowledgeEntryData[]>([])

  constructor() {
    afterRenderEffect(() => {
      this.filteredItems();
      Prism.highlightAll()
    });
  }

  async ngOnInit() {
    await this.readKnowledgeEntries()

  }

  /**
   * Reads the knoweledge_entry table from the database
   * Sets the entryDatas() & filteredItems() Signal to its initial state
   * The initial state contains all entries from the database
   */
  async readKnowledgeEntries(): Promise<void> {
    let database = await this.db.readKnowledgeEntries() as KnowledgeEntryData[]
    if (database.length > 0) {
      this.entryDatas.set(database)
      this.filteredItems.set(database)
    }
  }

  /**
   * Filters the entries according to the selected Tag from the User
   * Updates the displayed entries, by updating the according filteredItems() Signal
   * @param selectedTag - the selected Tag, the user wants to filter for
   */
  filterDatas(selectedTag: string[]) {
    selectedTag[0]
    let tempFilteredTags = []
    this.entryDatas().forEach(entry => {
      if (this.tagIsIncluded(entry, selectedTag[0])) {
        tempFilteredTags.push(entry)
      }
      this.filteredItems.update(() => tempFilteredTags)
    }
    );
    this.selectedValue = selectedTag[0]
  }

  /**
   * Checks if the current entry tag contains the selected Tag parameter
   * @param entry - the current entry that is checkewd
   * @param selectedTag - selected Tag from the User
   * @returns - true, if selectedTag is within entry.tags
   */
  tagIsIncluded(entry: KnowledgeEntryData, selectedTag: string): boolean {
    return entry.tags.some((tag) =>
      tag === selectedTag
    )
  }
}
