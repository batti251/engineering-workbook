import { inject, Service } from '@angular/core';
import { Keys } from '../shared/services/key';

@Service()
export class LocalStorage {
    private key = inject(Keys)
    token = this.getItem(this.key.token);
    json = this.parseJSON(this.token)

    getItem(key: string) {
        return localStorage.getItem(key)
    }

    parseJSON(item: string | null) {
        if (!item) return
        return JSON.parse(item)
    }

    deleteLocalStorage(key: string) {
        localStorage.removeItem(key)
    }

    /**
     * Returns the selected Tag as Array
     * It is exclusivley used for the listbox-select component
     * @returns - array with selected Tag
     */
    getActiveTag():string[] {
        let arr = []
        arr.push(localStorage.getItem('activeTag'))
        return arr as string[]
    }
}
