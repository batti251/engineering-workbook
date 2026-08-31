import { inject, Service } from '@angular/core';
import { Supabase } from './db';
import { Keys } from '../shared/services/key';

@Service()
export class Storage {
    db = inject(Supabase).db
    private key = inject(Keys)


    /**
     * Receives the storaged-path URL by returned path from {@linkdb.uploadFile()}
     * @param formArray 
     * @param file 
     */
    async getFileURLFromStorage(file: File, fileName: string) {
        try {
            const path = await this.uploadFileToStorage(file, fileName)
            return path?.path
        } catch (error) {
            console.log(error);
            return
        }
    }

    /**
     * Uploads the File to the storage
     * @param file - the img-file
     * @param fileName - the files name
     * @returns - the data-obj with path information
     */
    async uploadFileToStorage(file: File, fileName: string) {
        const { data, error } = await this.db.storage
            .from('screenshots')
            .upload(`${this.key.ImgStore}/${fileName}`, file)
        if (error) {
            console.log(`${this.key.ImgStore}/${fileName}`);
            return
        } else {
            console.log(`${this.key.ImgStore}/${fileName}`);
            return data
        }
    }

    /**
     * Delete the designated @param file from the storage
     * @param file - the file, that will be deleted
     * @returns 
     */
    async deleteFile(file: string):Promise<boolean> {
            await this.db
                .storage
                .from('screenshots')
                .remove([`${this.key.ImgStore}`, `${file}`])
        return true
    }
}
