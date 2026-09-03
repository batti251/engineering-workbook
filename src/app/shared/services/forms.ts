import { inject, Service } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Supabase } from '../../core/db';
import { Clipboard } from '../../core/clipboard';
import { KnowledgeEntryData, KnowledgeSubEntryData, tags } from '../interfaces/knowledge-entry-data';
import { Keys } from './key';
import { Storage } from '../../core/storage';

@Service()
export class Forms {
    clipboard = inject(Clipboard)
    db = inject(Supabase)
    formBuilder = inject(FormBuilder);
    key = inject(Keys)
    storage = inject(Storage)
    tempFiles: {
        file: File,
        indexSubEntry: number
    }[] = []

    storageImgPath = this.key.dbURL + '/' + this.key.dbStorage + '/' + this.key.ImgStore
    entryForm = this.buildMainEntryForm();
    signInForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    })

    /**
     * New Form: when no @param data is passed, one empty KnowledgeEntryData-Form will be build
     * Edit Form: when @param data is passed, one KnowledgeEntryData-Form, filled with @param data will be build
     * @param data 
     * @returns 
     */
    buildMainEntryForm(data?: KnowledgeEntryData) {
        return this.formBuilder.group({
            id: data?.id,
            title: [data?.title ?? '', Validators.required],
            description: [data?.description ?? '', Validators.required],
            tags: this.formBuilder.array([]),
            image: ['', Validators.required],
            subEntries: this.formBuilder.array([
                this.buildSubEntryForm()
            ]),
        })
    }

    /**
     * New Form: when no @param data is passed, one empty KnowledgeSubEntryData-Form will be build
     * Edit Form: when @param data is passed, one KnowledgeSubEntryData-Form, filled with @param data will be build
     * @param data 
     * @param subEntryIndex 
     * @returns 
     */
    buildSubEntryForm(data?: KnowledgeSubEntryData, subEntryIndex?: number) {
        return this.formBuilder.group({
            subTitle: this.formBuilder.control(data?.subTitle ?? ''),
            description: [data?.description ?? '', Validators.required],
            details: this.formBuilder.array([]),
            externalLinks: this.formBuilder.array([]),
            screenshots: this.formBuilder.array([]),
        })
    }

    /**
     * Edit Form: Builds a editable Form, filled with @param data
     * @param data 
     */
    buildEditForm(data: KnowledgeEntryData) {
        console.log(data);
        
        this.entryForm = this.buildMainEntryForm(data)
        let entry = this.entryForm.get('subEntries') as FormArray
        entry.removeAt(0)
        this.addTags(data)
        this.addSubEntry(data)
    }

    /**
     * New Form: builds a new, pristine Form 
     */
    buildNewForm() {
        this.entryForm = this.buildMainEntryForm()
    }

    /**
     * Edit Form: if @param data is passed, it calles {@link setEditSubEntries} for presetting the SubEntryform
     * New Form: adds a new, pristine KnowledgeSubEntryData-Form
     * @param data 
     * @returns 
     */
    addSubEntry(data?: KnowledgeEntryData):void {
        this.db.tempDBFiles = []
        if (data) {
            this.setEditSubEntries(data)
            return
        }
        this.subEntries.push(this.buildSubEntryForm());
    }

    /**
     * Edit Form: presets all SubEntry FormArrays
     * @param data 
     */
    setEditSubEntries(data: KnowledgeEntryData) {
        data.subEntries.forEach((subEntry, subEntryIndex) => {
            this.subEntries.push(this.buildSubEntryForm(subEntry, subEntryIndex))
            this.addDetailsControl(subEntryIndex, subEntry)
            this.addLinksControl(subEntryIndex, subEntry)
            this.addScreenshotControl(subEntryIndex, subEntry)
        })
    }

    /**
     * Removes the whole SubEntry according to its index
     * @param indexSubEntry - Index of the subEntry-group
     */
    removeSubEntries(indexSubEntry: number) {
        this.subEntries.removeAt(indexSubEntry)
    }

    /**
     * Gets the SubEntry Controsl Form Array according to SubEntries index
     * @param indexSubEntry - Index of the subEntry-group
     * @param target - the according controlname 
     */
    getSubEntryControls(indexSubEntry: number, target: string): FormArray {
        return this.subEntries.at(indexSubEntry).get(target) as FormArray
    }


    /**
     * Adds a new input @param target-field to the according @param indexSubEntry
     * @param indexSubEntry - Index of the subEntry-group
     * @param target 
     */
    addSubEntryControls(indexSubEntry: number, target: string) {
        let control = this.subEntries.at(indexSubEntry).get(target) as FormArray
        control?.push(this.formBuilder.control(''));
    }

    /**
     * Removes the FormControl at the given indices
     * @param indexSubEntry - Index of the subEntry-group
     * @param targetIndex - Index of the clicked target
     * @param subEntryData - name of the subEntry-Property
     */
    removeSubEntryControl(indexSubEntry: number, targetIndex: number, subEntryData: string): void {
        let control = this.subEntries.at(indexSubEntry).get(subEntryData) as FormArray
        if (subEntryData == 'screenshots') {
            this.db.toDeleteDBFiles.push(control.value[0])
        }
        control.removeAt(targetIndex)
    }

    /**
     * Edit Form: presets all detail-entries according to @param subEntryIndex @param subEntry  to the form 
     * @param subEntryIndex - Index of the subEntry-group
     * @param subEntry - Index of the link-array
     */
    addDetailsControl(subEntryIndex: number, subEntry: KnowledgeSubEntryData) {
        let control = this.subEntries.at(subEntryIndex).get('details') as FormArray
        subEntry?.details?.forEach(img => {
            this.db.tempDBFiles.push(img)
            control.push(this.formBuilder.control(img))
        })
    }

    /**
     * Edit Form: presets all links according to @param subEntryIndex @param subEntry  to the form 
     * @param subEntryIndex - Index of the subEntry-group
     * @param subEntry - Index of the link-array
     */
    addLinksControl(subEntryIndex: number, subEntry: KnowledgeSubEntryData) {
        let control = this.subEntries.at(subEntryIndex).get('externalLinks') as FormArray
        subEntry?.externalLinks?.forEach(detail => {
            control.push(this.formBuilder.control(detail))
        })
    }

    /**
     * Edit Form: presets all screenshots according to @param subEntryIndex @param subEntry  to the form 
     * @param subEntryIndex - Index of the subEntry-group
     * @param subEntry - Index of the link-array
     */
    addScreenshotControl(subEntryIndex: number, subEntry: KnowledgeSubEntryData) {
        let control = this.subEntries.at(subEntryIndex).get('screenshots') as FormArray
        subEntry?.screenshots?.forEach(img => {
            control.push(this.formBuilder.control(img))
        })
    }

    get tags() {
        return this.entryForm.get('tags') as FormArray;
    }

    /**
     * adds a new tag to the FormArray
     * Edit Form: when @param data is passed, it presets all tags from it
     * @param data 
     */
    addTags(data?: KnowledgeEntryData | string[]): void {
        this.tags.clear();
        if (!Array.isArray(data) && data) {
            data.tags.forEach(tag => {
                this.tags.push(this.formBuilder.control(tag));
            })
            return
        }  if (Array.isArray(data)) {
            data.forEach(tag => {
                this.tags.push(this.formBuilder.control(tag));
            })
        }
    }

    /**
     * removes the created tag
     * @param tagIndex 
     */
    removeTag(tagIndex: number) {
        this.tags.removeAt(tagIndex)
    }

    get subEntries() {
        return this.entryForm.get('subEntries') as FormArray;
    }

    /**
     * Adds pasted screenshot from the clipboard to tempFiles Array
     * @param event - the paste event
     * @param indexSubEntry - Index of the subEntry-group
     */
    addScreenshots(event: ClipboardEvent, indexSubEntry: number): void {
        let data = event.clipboardData?.items
        if (!data) return
        for (const item of data) {
            let fileObj = this.createBlobScreenshot(item, indexSubEntry)
            fileObj ? this.tempFiles.push(fileObj) : undefined;
        }
    }

    /**
     * Creates a blob URL
     * Adds it to the screenshot FormArray
     * @param item - the screenshot file
     * @param indexSubEntry - Index of the subEntry-group
     * @returns 
     */
    createBlobScreenshot(item: DataTransferItem, indexSubEntry: number) {
        let file = item.getAsFile()
        if (!file) return
        let url = URL.createObjectURL(file)
        this.setSubEntryScreenshot(indexSubEntry, url)
        let fileObj = {
            file: file,
            indexSubEntry: indexSubEntry,
        }
        return fileObj
    }

    /**
     * Clears all Screenshots from the screenshots FormArray
     */
    clearSubEntryScreenshot() {
        this.subEntries.controls.forEach(control => {
            let x = control.get('screenshots') as FormArray
            x.clear()
        });
    }

    /**
     * Sends all screenshots to the db
     * Shortens the screenshot FormArray to non-blob URLs
     */
    async sendScreenshotsToDB() {
        for (const file of this.tempFiles) {
            let fileName = this.setNewFileName(file.file)
            let screenshotURL = await this.storage.getFileURLFromStorage(file.file, fileName) as string
            this.setSubEntryScreenshot(file.indexSubEntry, screenshotURL)
            this.clearBlobScreenshot()
        }
        this.tempFiles = []
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
     * Adds the @param url to the screenshots FormArray
     * This is needed to send the correct URL-path to the db
     * @param indexSubEntry - Index of the subEntry-group
     * @param url - the db URL path
     */
    setSubEntryScreenshot(indexSubEntry: number, url: string) {
        let control = this.subEntries.at(indexSubEntry).get('screenshots') as FormArray
        control?.push(this.formBuilder.control(url));
    }

    /**
     * Removes all possible blob URLs from the screenshot FormArray
     * This should prevent adding temporary URL to the database
     */
    clearBlobScreenshot() {
        this.subEntries.controls.forEach(control => {
            let img = control.get('screenshots') as FormArray
            for (let i = img.length; i >= 0; i--) {
                let value = img?.at(i)?.value;
                if (value?.includes('blob')) {
                    img.removeAt(i)
                }
            }
        });
    }
}
