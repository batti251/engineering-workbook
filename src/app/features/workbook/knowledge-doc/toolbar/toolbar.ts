import { afterRenderEffect, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Select } from '../select/select';
import { LocalStorage } from '../../../../core/local-storage';
import { Supabase } from '../../../../core/db';
import { Auth } from '../../../../core/auth';
import { KnowledgeEntryData } from '../../../../shared/interfaces/knowledge-entry-data';

@Component({
  imports: [Select, RouterLink],
  selector: 'app-toolbar',
  styleUrl: './toolbar.scss',
  templateUrl: './toolbar.html',
})
export class Toolbar {
  private db = inject(Supabase)
  private local = inject(LocalStorage)
  private auth = inject(Auth)
  readonly filteredItems = signal<KnowledgeEntryData[]>([])
  selectedValue: string = ''


   constructor() {
    afterRenderEffect(() => {
      this.filteredItems();
    });
  }

  
  /**
   * Reads the users knoweledge_entry table according to the selected tag
   */
  async showFilteredEntries(): Promise<void> {
    let userId = await this.auth.getUserId()
    let activeTag = this.local.getActiveTag()
    let filteredDataBase = await this.db.readUserEntries(userId, activeTag[0]) as KnowledgeEntryData[]
    this.filteredItems.set(filteredDataBase)
    this.selectedValue = activeTag[0]
  }
}
