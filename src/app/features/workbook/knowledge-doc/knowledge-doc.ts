import { afterRenderEffect, Component, inject, signal } from '@angular/core';
import { Supabase } from '../../../core/db';
import { KnowledgeEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { Select } from './select/select';
import { RouterLink } from '@angular/router';
import { Keys } from '../../../shared/services/key';
import { LocalStorage } from '../../../core/local-storage';
import { Auth } from '../../../core/auth';
import { StickyHeader } from '../../../shared/directives/sticky-header';

@Component({
  selector: 'app-coding-doc',
  imports: [RouterLink, Select, StickyHeader],
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
  readonly filteredItems = signal<KnowledgeEntryData[]>([])

  constructor() {
    afterRenderEffect(() => {
      this.filteredItems();
    });
  }

  async ngOnInit() {
    await this.showFilteredEntries()
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
