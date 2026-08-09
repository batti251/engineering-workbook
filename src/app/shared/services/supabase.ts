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

    async addRow(userData:TableRow) {
        const { data, error } = await this.supabase
            .from('programming_language')
            .insert([
                { language: userData.language, 
                  title: userData.title, 
                  description: userData.description, 
                  syntax: userData.syntax, 
                  return_value: userData.return_value, 
                  use_cases: userData.use_cases
                 },
            ])
            .select()
    }

}
