import { inject, Service } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Supabase } from '../../core/supabase';
import { Clipboard } from '../../core/clipboard';
import { KnowledgeEntryData, KnowledgeSubEntryData } from '../interfaces/knowledge-entry-data';
import { Keys } from './key';

@Service()
export class Forms {
    clipboard = inject(Clipboard)
    db = inject(Supabase)
    formBuilder = inject(FormBuilder);
    key = inject(Keys)
    tempFiles: {
        file: File,
        indexSubEntry: number
    }[] = []

    storageImgPath = this.key.supabaseURL + '/' + this.key.supabaseStorage + '/' + this.key.supabasePNGStore
    entryForm = this.buildMainEntryForm();


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


    buildSubEntryForm(data?: KnowledgeSubEntryData, subEntryIndex?: number) {
        return this.formBuilder.group({
            subTitle: this.formBuilder.control(data?.subTitle ?? ''),
            description: [data?.description ?? '', Validators.required],
            details: this.formBuilder.array([]),
            externalLinks: this.formBuilder.array([]),
            screenshots: this.formBuilder.array([]),
        })
    }

    buildEditForm(data: KnowledgeEntryData) {
        this.entryForm = this.buildMainEntryForm(data)
        let entry = this.entryForm.get('subEntries') as FormArray
        entry.removeAt(0)
        this.addTags(data)
        this.addSubEntry(data)
    }

    buildNewForm() {
        this.entryForm = this.buildMainEntryForm()
    }

    signInForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    })


    addSubEntry(data?: KnowledgeEntryData) {
        this.db.tempDBFiles = []

        if (data) {
            data.subEntries.forEach((subEntry, subEntryIndex) => {
                this.subEntries.push(this.buildSubEntryForm(subEntry, subEntryIndex))
                this.addSubEntryControls(subEntryIndex, 'details', subEntry)
                this.addSubEntryControls(subEntryIndex, 'externalLinks', subEntry)
                this.addSubEntryControls(subEntryIndex, 'screenshots', subEntry)
            })
            console.log(data);
            return
        }

        this.subEntries.push(this.buildSubEntryForm());
    }

    removeSubEntries(index: number) {
        this.subEntries.removeAt(index)
    }

    getSubEntryControls(item: number, target: string) {
        if (target == 'screenshots') {
        }
        return this.subEntries.at(item).get(target) as FormArray
    }


    addSubEntryControls(index: number, target: string, data?: KnowledgeSubEntryData) {
        let control = this.subEntries.at(index).get(target) as FormArray
        if (data) {
            switch (target) {
                case 'details':
                    data?.details?.forEach(detail => {
                        control.push(this.formBuilder.control(detail))
                    })
                    break;
                case 'externalLinks':
                    data?.externalLinks?.forEach(link => {
                        control.push(this.formBuilder.control(link))
                    })
                    break;
                case 'screenshots':
                    data?.screenshots?.forEach(img => {
                        this.db.tempDBFiles.push(img)
                        control.push(this.formBuilder.control(img))
                    })
                    break;
                default:
                    break;
            }
            return
        }
        if (control) {
            control.push(this.formBuilder.control(''));
        }
    }

    removeSubEntryCotrol(indexSubEntry: number, targetIndex: number, target: string) {
        let control = this.subEntries.at(indexSubEntry).get(target) as FormArray
        control.removeAt(targetIndex)

        if (target == 'screenshots') {
            console.log(target);
            console.log(control.value[0]);
            this.db.toDeleteDBFiles.push(control.value[0])
        }
    }


    get tags() {
        return this.entryForm.get('tags') as FormArray;
    }

    addTags(data?: KnowledgeEntryData) {
        if (data) {
            data.tags.forEach(tag => {
                this.tags.push(this.formBuilder.control(tag));
            })
            return
        }
        this.tags.push(this.formBuilder.control(''));
    }

    removeTag(index: number) {
        this.tags.removeAt(index)
    }

    get subEntries() {
        return this.entryForm.get('subEntries') as FormArray;
    }

    get useCases() {
        return this.subEntries.get('useCases') as FormArray;
    }



    removeUseCases(index: number) {
        this.useCases.removeAt(index)
    }

    get externalLinks() {
        return this.subEntries.get('externalLinks') as FormArray;
    }

    addExternalLinks() {
        this.externalLinks.push(this.formBuilder.control(''));
    }

    removeExternalLinks(index: number) {
        this.externalLinks.removeAt(index)
    }

    get screenshots() {
        return this.subEntries.get('screenshots') as FormArray;
    }


    getSubEntryScreenshot(indexSubEntry: number, url: string) {
        let control = this.subEntries.at(indexSubEntry).get('screenshots') as FormArray
        if (control) {
            control.push(this.formBuilder.control(url));
        }
    }


    addScreenshots(event: ClipboardEvent, indexSubEntry: number) {
        let data = event.clipboardData?.items
        if (!data) return
        for (const item of data) {
            let file = item.getAsFile()
            if (!file) return
            let url = URL.createObjectURL(file)
            this.getSubEntryScreenshot(indexSubEntry, url)
            let fileObj = {
                file: file,
                indexSubEntry: indexSubEntry,
            }
            this.tempFiles.push(fileObj)
        }
    }


    /**
     * removes indexed screenshot-url from temporary Array
     * @param index 
     */
    removeTempDBScreenshot(index: number) {
        this.screenshots.removeAt(index)
        this.db.toDeleteDBFiles.push(this.db.tempDBFiles[index])
        this.db.tempDBFiles.splice(index, 1)
    }

    clearSubEntryScreenshot() {
        this.subEntries.controls.forEach(control => {
            let x = control.get('screenshots') as FormArray
            x.clear()
        });
        console.log(this.subEntries.controls);

    }

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


    async addScreenshotsToDB(isedit?: boolean) {
        if (!isedit) {
            this.clearSubEntryScreenshot()
        }
        for (const file of this.tempFiles) {
            let screenshotURL = await this.db.addScrenshot(file.file) as string
            this.getSubEntryScreenshot(file.indexSubEntry, screenshotURL)
            this.clearBlobScreenshot()
        }
        this.tempFiles = []
    }


    patchEditForm(data: KnowledgeEntryData) {
        this.entryForm.patchValue({
            id: data?.id,
            title: data?.title,
            description: data?.description,
            tags: data?.tags,
            image: data?.image,
            /* subEntries: data?.subEntries */
        })
    }

    resetFormEditArrays(property: FormArray) {
        property.controls = []
    }

}
