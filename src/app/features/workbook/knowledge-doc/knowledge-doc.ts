import { afterRenderEffect, Component, computed, ElementRef, EventEmitter, HostListener, inject, Output, signal, ViewChild } from '@angular/core';
import { Supabase } from '../../../core/db';
import { KnowledgeEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { Select } from './select/select';
import { RouterLink } from '@angular/router';
import { Keys } from '../../../shared/services/key';
import { LowerCasePipe } from '@angular/common';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import { LocalStorage } from '../../../core/local-storage';
import { Auth } from '../../../core/auth';
import { StickyHeader } from '../../../shared/directives/sticky-header';

@Component({
  selector: 'app-coding-doc',
  imports: [RouterLink, Select, LowerCasePipe, StickyHeader],
  templateUrl: './knowledge-doc.html',
  styleUrl: './knowledge-doc.scss',
})
export class KnowledgeDoc {

  private db = inject(Supabase)
  private local = inject(LocalStorage)
  private auth = inject(Auth)
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
    await this.filterDatas(this.local.getActiveTag())
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
  async filterDatas(selectedTag: string[]) {
    selectedTag[0]
    let tempFilteredTags = []
    let userId = await this.auth.getUserId()
    this.entryDatas().forEach(entry => {
      if (this.tagIsIncluded(entry, selectedTag[0]) && entry.userId === userId) {
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
