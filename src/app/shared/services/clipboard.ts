import { Service } from '@angular/core';

@Service()
export class Clipboard {

    files: File[] = []
    tempFiles: string[] = []

    /**
      * Stores temporary screenshot file in files-Array
      * @param event - the paste-event triggered by the user
      * @returns 
      */
    async addTempScreenshot(event: ClipboardEvent) {
        let data = event.clipboardData?.items
        if (!data) return
        for (const item of data) {
            let file = item.getAsFile()
            if (!file) return
            this.createTempBlobURL(file)
            this.files.push(file)
            break;
        }
    }

    /**
     * creates temporary blob-url and stores it into temporary Arraay
     * @param file - the screenshot-file
     */
    createTempBlobURL(file: File) {
        let tempURL = URL.createObjectURL(file)
        this.tempFiles.push(tempURL)
    }

    /**
 * removes indexed screenshot-url from temporary Array
 * @param index 
 */
    removeTempScreenshot(index: number) {
        this.tempFiles.splice(index, 1)
    }

}
