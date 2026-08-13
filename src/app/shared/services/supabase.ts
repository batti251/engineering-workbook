import { inject, Service } from '@angular/core';
import { createClient } from '@supabase/supabase-js'
import { Keys } from './key';
import { TableRow } from '../interfaces/table-row';

@Service()
export class Supabase {
    key = inject(Keys)

    supabase = createClient(this.key.supabaseURL, this.key.supabaseKey)

    async readDB() {
        let { data: programming_language, error } = await this.supabase
            .from('programming_language')
            .select('*')
        return programming_language
    }

     readScreenshot(img:string) {
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

    /**
     * sets a random name by crypto.randomUUID-Function
     * @param file - the img-file
     * @returns - new random name-string
     */
    setNewFileName(file:File){
        let fileType = file.name.split(".")[1]
        let name = crypto.randomUUID()
        return name + "." + fileType
    }
}
