import { inject, Service, signal } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import { Keys } from '../shared/services/key';
import { KnowledgeEntryData } from '../shared/interfaces/knowledge-entry-data';
import { Clipboard } from './clipboard';
import { FormBuilder } from '@angular/forms';

@Service()
export class Supabase {
    key = inject(Keys)
    channelAll!: RealtimeChannel
    supabase = createClient(this.key.supabaseURL, this.key.supabaseKey)
    realtimeEventType = signal('')
    clipboard = inject(Clipboard)

    tempDBFiles: string[] = []
    toDeleteDBFiles: string[] = []

    isRowUpdated = false
    isFileDeleted = false
    isRowAdded = false
    formBuilder = inject(FormBuilder);


    constructor() {
        this.startChannel(this.channelAll)
    }

    startChannel(channel: RealtimeChannel) {
        channel = this.supabase
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

    async readDB() {
        let { data: knowledge_entry, error } = await this.supabase
            .from('knowledge_entry')
            .select('*')
        return knowledge_entry
    }

    async readDBEntry(id: string) {
        let { data: knowledge_entry, error } = await this.supabase
            .from('knowledge_entry')
            .select('*')
            .eq('id', id)
        return knowledge_entry
    }

    readScreenshot(img: string) {
        const { data } = this.supabase.storage
            .from(`${this.key.supabaseScreenshots}`)
            .getPublicUrl(img)
        return data.publicUrl
    }


    async addRow(userData: KnowledgeEntryData) {
        const { data, error } = await this.supabase
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
        console.log(userData);

        return false
    }

    async updateRow(editedData: KnowledgeEntryData) {
        const { data, error } = await this.supabase
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

    async deleteRow(id: number) {
        const { error } = await this.supabase
            .from('knowledge_entry')
            .delete()
            .eq('id', id)
        return error
    }




    async deleteFile(file: string[]) {
        file.forEach(async file => {
            await this.supabase
                .storage
                .from('screenshots')
                .remove([`${this.key.supabasePNGStore}`, `${file}`])
        })
        return true
    }

    /**
     * sets a random name by crypto.randomUUID-Function
     * @param file - the img-file
     * @returns - new random name-string
     */
    setNewFileName(file: File) {
        let fileType = file.name.split(".")[1]
        let name = crypto.randomUUID()
        return name + "." + fileType
    }


    /**
 * Adds new form-control to surveyEditForm.screenshots-FormArray
 * Receives storaged-path by returned path from {@linkdb.uploadFile()}
 * @param formArray 
 * @param file 
 */
    async addScrenshot(file: File) {
        try {
            const path = await this.uploadFile(file)
            if (path) {
                return path.path
            }
            else return ''
        } catch (error) {
            console.log(error);
            return
        }
    }

    /**
     * Adds File to supabase storage
     * @param file - the img-file
     * @returns - the data-obj with path information
     */
    async uploadFile(file: File) {
        const newFileName = this.setNewFileName(file)
        const { data, error } = await this.supabase.storage
            .from('screenshots')
            .upload(`${this.key.supabasePNGStore}/${newFileName}`, file)
        if (error) {
            console.log(`${this.key.supabasePNGStore}/${newFileName}`);

            return
        } else {
            console.log(`${this.key.supabasePNGStore}/${newFileName}`);

            return data
        }
    }

    checkDBHandling() {
        if (this.isRowUpdated || this.isFileDeleted || this.isRowAdded) {
            return true
        } else return false
    }

    async deleteEntryFromDB(id: any) {
        if (!Number(id.value)) {
            return
        }
        try {
            let deleteTrigger = await this.deleteRow(id.value)
            console.log(deleteTrigger);
            if (!deleteTrigger) {
                this.refreshComponent()
            }
        } catch (error) {

        }
    }

    refreshComponent() {
        window.location.reload()
    }
}
