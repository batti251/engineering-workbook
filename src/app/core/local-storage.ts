import { Service } from '@angular/core';

@Service()
export class LocalStorage {

    getItem(key:string){
        return localStorage.getItem(key)
    }

    parseJSON(item:string){
       return JSON.parse(item)
    }

    deleteLocalStorage(key:string){
        localStorage.removeItem(key)
    }
}
