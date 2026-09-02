import { inject, Service, signal } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import { Keys } from '../shared/services/key';
import { KnowledgeEntryData, tags } from '../shared/interfaces/knowledge-entry-data';

@Service()
export class Supabase {
    private key = inject(Keys)
    db = createClient(this.key.dbURL, this.key.dbKey)
    
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
        console.log(payload);
        this.realtimeEventType.set(payload.eventType)
        console.log(this.realtimeEventType());
    }

    /**
     * Creates a new Knowledge Entry to the db
     * @param userData - the filled KnowledgeEntryData from the form-component  
     * @returns 
     */
    async createNewKnowledgeEntry(userData: KnowledgeEntryData):Promise<boolean> {
        const { data, error } = await this.db
            .from('knowledge_entry')
            .insert([
                {
                    title: userData.title,
                    description: userData.description,
                    tags: userData.tags,
                    image: userData.image,
                    subEntries: userData.subEntries,
                },
            ])
            .select()
        if (!error) {
            return true
        } else
            console.log(error);
        return false
    }

    /**
     * Reads and returns the database KnowledgeEntryDatas
     * @returns 
     */
    async readKnowledgeEntries():Promise<KnowledgeEntryData[]> {
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
    async readSingleKnowledgeEntry(id: string):Promise<KnowledgeEntryData[]> {
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
    async readDbTable(table:string):Promise<(KnowledgeEntryData|tags)[]> {
        let { data: data, error } = await this.db
            .from(table)
            .select('*') 
        return data as (KnowledgeEntryData|tags)[] 
    }

    /**
     * Updates the existing equivalent row in the db, with the users @param editedData
     * @param editedData - the edited KnowledgeEntryData from the form-component
     * @returns 
     */
    async updateKnowledgeEntry(editedData: KnowledgeEntryData):Promise<boolean> {
        const { data, error } = await this.db
            .from('knowledge_entry')
            .update({
                title: editedData.title,
                description: editedData.description,
                tags: editedData.tags,
                image: editedData.image,
                subEntries: editedData.subEntries,
            })
            .eq('id', editedData.id)
            .select()
        if (!error) {
            return true
        } else return false
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
        return error
    }
}
