import { Component, effect, inject, signal } from '@angular/core';
import { Supabase } from '../../../core/db';
import { tags } from '../../../shared/interfaces/knowledge-entry-data';
import { LocalStorage } from '../../../core/local-storage';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { LowerCasePipe } from '@angular/common';
import { ForwardRefHandling } from '@angular/compiler';

@Component({
  selector: 'app-custom-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './custom-settings.html',
  styleUrl: './custom-settings.scss',
})
export class CustomSettings {
  db = inject(Supabase)
  storage = inject(LocalStorage)
  formbuilder = inject(FormBuilder)

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


  newTagForm = this.formbuilder.group({
    tagName: ['', Validators.required]
  })

  async ngOnInit() {
    await this.getTags();
    if (this.storage.token) {
      let userToken = JSON.parse(this.storage.token)
      this.userId.update(() => userToken.user.id)
    }
  }

 constructor(){
  effect (async () => {
    this.storage.reloadToken()
  })
 }

  async getTags() {
    const tagsFromDB = await this.db.readDbTable('tags') as tags[]
    this.currentTags.update(() => tagsFromDB)
  }

  async submitNewTag() {
    const tagsFromDB = await this.db.readDbTable('tags') as tags[]
    const newTagFromUser = this.newTagForm.value
    if (this.tagAlreadyExist(tagsFromDB, newTagFromUser)) {
      return
    }
    this.db.addCustomTag('tags', newTagFromUser.tagName as string, this.userId())
  }

  tagAlreadyExist(tagDB: tags[], tagUser: Partial<{
    tagName: string | null;
  }>) {
    return tagDB.some(item => item.tag.toLowerCase().trim() === tagUser.tagName?.toLowerCase().trim())
  }
}
