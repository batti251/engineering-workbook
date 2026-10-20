import { inject, Service, signal } from '@angular/core';
import { createClient, PostgrestError, RealtimeChannel } from '@supabase/supabase-js'
import { Keys } from '../shared/services/key';
import { KnowledgeEntryData, tags } from '../shared/interfaces/knowledge-entry-data';

@Service()
export class Supabase {
    private key = inject(Keys)
    db = createClient(this.key.dbURL, this.key.dbKey)
    crudSuccess = signal<boolean>(false)
    channelAll!: RealtimeChannel
    realtimeEventType = signal('')

    tempDBFiles: string[] = []
    toDeleteDBFiles: string[] = []

    constructor() {
        this.startChannel(this.channelAll)
    }

    startChannel(channel: RealtimeChannel) {
        channel = this.db
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                },
                (payload) => this.setEventType(payload)

            )
            .subscribe()
    }

    setEventType(payload: any) {
        this.realtimeEventType.set(payload.eventType)
    }

    /**
     * Creates a new Knowledge Entry to the db
     * @param userData - the filled KnowledgeEntryData from the form-component  
     * @returns 
     */
    async createNewKnowledgeEntry(userData: KnowledgeEntryData): Promise<void> {
        const { data, error } = await this.db
            .from('knowledge_entry')
            .insert([
                {
                    title: userData.title,
                    description: userData.description,
                    tags: userData.tags,
                    subEntries: userData.subEntries,
                    userId: userData.userId
                },
            ])
            .select()
        if (error) {
            throw new Error(error.code)
        }
    }

    /**
     * Reads and returns the database KnowledgeEntryDatas
     * @returns 
     */
    async readKnowledgeEntries(): Promise<KnowledgeEntryData[]> {
        let { data: knowledge_entry, error } = await this.db
            .from('knowledge_entry')
            .select('*')
        return knowledge_entry as KnowledgeEntryData[]
    }

    /**
     * Reads and returns the database KnowledgeEntryData equivalent to @param id.
     * @param id - the entry Id
     * @returns 
     */
    async readSingleKnowledgeEntry(id: string): Promise<KnowledgeEntryData[]> {
        let { data: knowledge_entry, error } = await this.db
            .from('knowledge_entry')
            .select('*')
            .eq('id', id)
        return knowledge_entry as KnowledgeEntryData[]
    }

    /**
    * Reads and returns the database KnowledgeEntryDatas
    * @returns 
    */
    async readDbTable(table: string): Promise<(KnowledgeEntryData | tags | string)[]> {
        let { data: data, error } = await this.db
            .from(table)
            .select('*')
        return data as (KnowledgeEntryData | tags | string)[]
    }

    /**
 * Creates a new Knowledge Entry to the db
 * @param userData - the filled KnowledgeEntryData from the form-component  
 * @returns 
 */
    async addCustomTag(table: string, userTag: string, userId: string): Promise<void> {
        this.crudSuccess.update(() => false)
        const { data, error } = await this.db
            .from(table)
            .insert([
                {
                    tag: userTag,
                    userId: userId
                }],
            )
            .eq('userId', userId)
            .select()
        if (error) {
            throw new Error(error.code)
        }
        this.crudSuccess.update(() => true)
    }

    /**
     * updates the tagname entry
     * @param id - id in database
     * @param newTag - new tagname
     */
    async editCustomTag(id: number, newTag:string): Promise<void> {
        this.crudSuccess.update(() => false)
        const { data, error } = await this.db
            .from('tags')
            .update([
                {
                    tag: newTag,
                },
            ])
            .eq('id', id)
            .select()
        if (error) {
            throw new Error(error.code)
        }
        this.crudSuccess.update(() => true)
    }


    /**
     * Updates the tags column from the single Entry in the database 
     * @param entry - the updated entry-object
     */
    async updateTagKnowledgeEntry(entry: KnowledgeEntryData): Promise<void> {
        const { data, error } = await this.db
            .from('knowledge_entry')
            .update({
                tags: entry.tags,
            })
            .eq('id', entry.id)
            .select()
            console.log(data);
            
        if (error) {
            throw new Error('Das hat nicht funktioniert!', error)
        }
    }



    async deleteCustomTag(tagId: number) {
        this.crudSuccess.update(() => false)
        const { data, error } = await this.db
            .from('tags')
            .delete()
            .eq('id', tagId)
        this.crudSuccess.update(() => true)
    }
    /**
     * Updates the existing equivalent row in the db, with the users @param editedData
     * @param editedData - the edited KnowledgeEntryData from the form-component
     * @returns 
     */
    async updateKnowledgeEntry(editedData: KnowledgeEntryData): Promise<void> {
        const { data, error } = await this.db
            .from('knowledge_entry')
            .update({
                title: editedData.title,
                description: editedData.description,
                tags: editedData.tags,
                subEntries: editedData.subEntries,
                userId: editedData.userId
            })
            .eq('id', editedData.id)
            .select()
        if (error) {
            throw new Error('Das hat nicht funktioniert!', error)
        }
    }

    /**
     * Equivalent to the @param id, deletes the matched row from the db 
     * @param id - the entry Id
     * @returns 
     */
    async deleteKnowledgeEntry(id: number) {
        const { error } = await this.db
            .from('knowledge_entry')
            .delete()
            .eq('id', id)
        if (error) {
            throw new Error('Löschung nicht erfoglreich! Bitte nochmal versuchen', error)
        }
    }
}
