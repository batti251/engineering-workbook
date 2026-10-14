import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { Supabase } from '../../../../core/db';
import { LocalStorage } from '../../../../core/local-storage';
import { tags } from '../../../../shared/interfaces/knowledge-entry-data';



@Component({
  selector: 'app-tags',
  imports: [ReactiveFormsModule],
  templateUrl: './tags.html',
  styleUrl: './tags.scss',
})
export class Tags {
db = inject(Supabase)

  storage = inject(LocalStorage)
  formbuilder = inject(FormBuilder)
  formSubmitted = signal<boolean>(false)
  currentTags = signal<tags[]>([{
    id: 0,
    tag: '',
    userId: ''
  }])
  personalTags = signal<tags[]>([{
    id: 0,
    tag: '',
    userId: ''
  }])

  
  userId = signal<string>('')
  tagDoesExist = signal<boolean>(false)


  newTagForm = this.formbuilder.group({
    tagName: ['', [Validators.required, Validators.pattern(/^\S+$/)]]
  })

  async ngOnInit() {
    await this.getTags();
    if (this.storage.token) {
      let userToken = JSON.parse(this.storage.token)
      this.userId.update(() => userToken.user.id)
    }
  }

  constructor() {
    effect(async () => {
      this.storage.reloadToken()
      if (this.db.crudSuccess()) {
        await this.getTags()
      }
    })
  }

  async getTags() {
    const tagsFromDB = await this.db.readDbTable('tags') as tags[]
    this.currentTags.update(() => tagsFromDB)
  }

  hasPersonalTags() {
    return this.currentTags().some(tag => tag.userId === this.userId())
  }

  async submitNewTag() {
    this.formSubmitted.update(() => true)
    const tagsFromDB = await this.db.readDbTable('tags') as tags[]
    const newTagFromUser = this.newTagForm.value
    if (this.tagAlreadyExist(tagsFromDB, newTagFromUser)) {
      return
    }
    if (this.newTagForm.controls.tagName.value?.trim() == '') {
      return
    }
    this.db.addCustomTag('tags', newTagFromUser.tagName as string, this.userId())
    this.newTagForm.controls.tagName.setValue('')
  }

  resetError() {
    let x = document.querySelector('.error')
    x?.classList?.remove('show')
    this.formSubmitted.update(() => false)

  }


  tagAlreadyExist(tagDB: tags[], tagUser: Partial<{
    tagName: string | null;
  }>) {
    this.tagDoesExist.update(() => tagDB.some(item => item.tag.toLowerCase().trim() === tagUser.tagName?.toLowerCase().trim()));
    return tagDB.some(item => item.tag.toLowerCase().trim() === tagUser.tagName?.toLowerCase().trim())
  }

}
