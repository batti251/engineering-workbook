import { signal } from '@angular/aria/private';
import { computed, effect, inject, Service } from '@angular/core';
import { KnowledgeEntryData, tags } from '../../../shared/interfaces/knowledge-entry-data';
import { Supabase } from '../../../core/db';
import { LocalStorage } from '../../../core/local-storage';
import { Auth } from '../../../core/auth';

@Service()
export class Filter {
  private db = inject(Supabase)
  private local = inject(LocalStorage)
  private auth = inject(Auth)
  filteredItems = signal<KnowledgeEntryData[]>([])
  readonly searchedItems = signal<KnowledgeEntryData[]>([])
  selectedValue = signal('')
  labels: string[] = [];

  constructor() {
    effect(async () => {
      await this.getAllTagsFromDB();
      this.showFilteredEntries()
    })
  }


  async getAllTagsFromDB() {
    let getTags = await this.db.readDbTable('tags') as tags[];
    let userId = await this.auth.getUserId()
    let filteredTags = getTags.filter(item => item.userId === 'global' || item.userId === userId)
    filteredTags.forEach((tag) => {
      this.labels.push(tag.tag)
    })
  }

  /**
   * Updates the filteredItems-signal by the key-word, the user types in
   * @param userInput - the text input, the user provides
   * @returns 
   */
  filterBySearchTerm(userInput: string) {
    this.filteredItems.set(this.searchedItems())
    if (userInput.length < 2) return
    let filteredList = this.searchedItems().filter((item) => {
      return item.description.toLowerCase().includes(userInput.toLowerCase()) ||
        item.title.toLowerCase().includes(userInput.toLowerCase())
    })
    this.filteredItems.update(() => filteredList)
  }

  /**
   * Reads the users knowledge_entry table according to the selected tag
   */
  async showFilteredEntries(): Promise<void> {
    let userId = await this.auth.getUserId()
    let activeTag = this.local.getActiveTag()
    let filteredDataBase = await this.db.readUserEntries(userId, activeTag[0]) as KnowledgeEntryData[]
    this.filteredItems.set(filteredDataBase)
    this.searchedItems.set(filteredDataBase)
  }
}
