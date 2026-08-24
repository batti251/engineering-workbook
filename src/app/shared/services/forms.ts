import { inject, Service } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supabase } from '../../core/supabase';
import { Clipboard } from '../../core/clipboard';
import { KnowledgeEntryData } from '../interfaces/knowledge-entry-data';

@Service()
export class Forms {
    clipboard = inject(Clipboard)
    db = inject(Supabase)
    formBuilder = inject(FormBuilder);
    tempFiles: File[] = []

    surveyForm = this.formBuilder.group({
        id: 0,
        language: ['', Validators.required],
        description: ['', Validators.required],
        syntax: ['', Validators.required],
        return_value: ['', Validators.required],
        properties: this.formBuilder.array([]),
        use_cases: this.formBuilder.array([]),
        screenshots: this.formBuilder.array([])
    });

    signInForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    })

    get useCases() {
        return this.surveyForm.get('use_cases') as FormArray;
    }

    addUseCase() {
        this.useCases.push(this.formBuilder.control(''));
    }

    get properties() {
        return this.surveyForm.get('properties') as FormArray;
    }

    addProperty() {
        this.properties.push(this.formBuilder.control(''));
    }

    get screenshots() {
        return this.surveyForm.get('screenshots') as FormArray;
    }



    addScreenshots(event: ClipboardEvent) {
        let data = event.clipboardData?.items
        if (!data) return
        for (const item of data) {
            let file = item.getAsFile()
            if (!file) return
            let url = URL.createObjectURL(file)
            this.screenshots.push(this.formBuilder.control(url));
            this.tempFiles.push(file)
        }
    }


    removeUseCase(index: number) {
        this.useCases.removeAt(index)
    }

    removeProperty(index: number) {
        this.properties.removeAt(index)
    }
    removeScreenshot(index: number) {
        this.screenshots.removeAt(index)
        this.tempFiles.splice(index, 1)
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

    /**
   * 
   */
    async addScreenshotsToDB(isedit?:boolean) {
        if (!isedit) {
            this.screenshots.clear()
        }
        for (const file of this.tempFiles) {
            let screenshotURL = await this.db.addScrenshot(file)
            this.screenshots.push(this.formBuilder.control(screenshotURL))
        }
        this.tempFiles = []
    }


    patchEditForm(data: KnowledgeEntryData) {
        this.surveyForm.patchValue({
            id: data?.id,
            language: data?.language,
            description: data?.description,
            syntax: data?.syntax,
            properties: data?.properties,
            return_value: data?.return_value,
            screenshots: data?.screenshots
        })
    }

    resetFormEditArrays(property: FormArray) {
        property.controls = []
    }

    setOptionalFormControls(data: KnowledgeEntryData) {
        data?.properties?.forEach(property => {
            this.properties.push(this.formBuilder.control(property))
        })

        data?.use_cases?.forEach(useCase => {
            this.useCases.push(this.formBuilder.control(useCase))
        })

        data?.screenshots?.forEach(screenshot => {
            this.screenshots.push(this.formBuilder.control(screenshot))
        })
    }
}
