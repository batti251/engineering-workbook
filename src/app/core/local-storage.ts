import { inject, Service } from '@angular/core';
import { Keys } from '../shared/services/key';

@Service()
export class LocalStorage {
private key = inject(Keys)
    token = this.getItem(this.key.token);
    json = this.parseJSON(this.token) 

    getItem(key:string){
        return localStorage.getItem(key)
    }

    parseJSON(item:string|null){
        if (!item) return
       return JSON.parse(item)
    }

    deleteLocalStorage(key:string){
        localStorage.removeItem(key)
    }
}
