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
                    use_cases: userData.use_cases
                },
            ])
            .select()
    }

    async updateRow(editedData: TableRow) {
        const { data, error } = await this.supabase
            .from('programming_language')
            .update({ 
                'language': editedData.language,
                'description': editedData.description,
                'syntax': editedData.syntax,
                'return_value': editedData.return_value,
                'use_cases': editedData.use_cases,
                'properties': editedData.properties
            })
            .eq('id', editedData.id)
            .select()
            console.log(error);
            
    }
}
