import { inject, Service, signal } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import { Keys } from './key';
import { TableRow } from '../interfaces/table-row';
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
        let { data: programming_language, error } = await this.supabase
            .from('programming_language')
            .select('*')
        return programming_language
    }

    readScreenshot(img: string) {
        const { data } = this.supabase.storage
            .from(`${this.key.supabaseScreenshots}`)
            .getPublicUrl(img)
        return data.publicUrl
    }


    async addRow(userData: TableRow) {
        const { data, error } = await this.supabase
            .from('programming_language')
            .insert([
                {
                    language: userData.language,
                    description: userData.description,
                    syntax: userData.syntax,
                    return_value: userData.return_value,
                    properties: userData.properties,
                    use_cases: userData.use_cases,
                    screenshots: userData.screenshots
                },
            ])
            .select()
        if (!error) {
            return true
        } else return false
    }

    async updateRow(editedData: TableRow) {
        const { data, error } = await this.supabase
            .from('programming_language')
            .update({
                language: editedData.language,
                description: editedData.description,
                syntax: editedData.syntax,
                return_value: editedData.return_value,
                use_cases: editedData.use_cases,
                properties: editedData.properties,
                screenshots: editedData.screenshots
            })
            .eq('id', editedData.id)
            .select()
        if (!error) {
            return true
        } else return false
    }

    async deleteRow(id: number) {
        const { error } = await this.supabase
            .from('programming_language')
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
        } catch (error) {
            console.log(error);
            return
        }
        return
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
            return 
        } else {
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
