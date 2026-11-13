import { signal } from '@angular/aria/private';
import { effect, inject, Service } from '@angular/core';
import { KnowledgeEntryData, tags } from '../../../shared/interfaces/knowledge-entry-data';
import { Supabase } from '../../../core/db';
import { LocalStorage } from '../../../core/local-storage';
import { Auth } from '../../../core/auth';

@Service()
export class Filter {
    private db = inject(Supabase)
    private local = inject(LocalStorage)
    private auth = inject(Auth)
    readonly filteredItems = signal<KnowledgeEntryData[]>([])
    selectedValue = signal('')
    labels: string[] = [];

    constructor(){
        console.log("filter da");
        effect( async() => {
            console.log(this.selectedValue());
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
 * Reads the users knowledge_entry table according to the selected tag
 */
    async showFilteredEntries(): Promise<void> {
        let userId = await this.auth.getUserId()
        let activeTag = this.local.getActiveTag()
        let filteredDataBase = await this.db.readUserEntries(userId, activeTag[0]) as KnowledgeEntryData[]
        this.filteredItems.set(filteredDataBase)
    }
}
