import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Supabase } from '../../../../core/db';
import { LocalStorage } from '../../../../core/local-storage';
import { tags } from '../../../../shared/interfaces/knowledge-entry-data';
import { KnowledgeEntry } from '../../../../shared/models/knowledge-entry';



@Component({
  selector: 'app-tags',
  imports: [ReactiveFormsModule],
  templateUrl: './tags.html',
  styleUrl: './tags.scss',
})
export class Tags {
  db = inject(Supabase)
  editTag = signal<number | undefined>(undefined)
  tagNameBeforeEdit = signal<string>('')
  storage = inject(LocalStorage)
  formbuilder = inject(FormBuilder)
  formSubmitted = signal<boolean>(false)
  toUpdateEntries = signal<KnowledgeEntry[]>([])

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

  /**
   * Presets initiate State for editing the tagname
   * safeguards current tag value
   * Prefills Input control with current tag value
   * @param initialTagName - the original tagname from the database
   * @param tagIndex - the tags index from the database
   */
  editCustomTag(initialTagName: string, tagIndex: number) {
    this.editTag.update(() => tagIndex)
    this.tagNameBeforeEdit.update(() => initialTagName)
    this.newTagForm.controls.tagName.setValue(initialTagName)
  }

  /**
   * This function is triggered by users action
   * Calls namechange- and entry update- functions
   */
  async submitEditTag() {
    this.formSubmitted.update(() => true)
    const tagsFromDB = await this.db.readDbTable('tags') as tags[]
    let newTagFromUser = this.newTagForm.value

    if (!this.isValidTagInput(tagsFromDB, newTagFromUser)) {
      this.formSubmitted.update(() => false)
      return
    }

    await this.updateDBTagName(tagsFromDB, newTagFromUser)
    await this.updateTagsInEntries(newTagFromUser)
  }

  /**
   * Validates if the inputs tagname already exists in the db or is empty
   * @param tagsFromDB - the current tags from the database
   * @param newTagName - the new insert tagname from the user
   */
  isValidTagInput(tagsFromDB: tags[], newTagName: Partial<{
    tagName: string | null;
  }>): boolean {
    if (this.tagAlreadyExist(tagsFromDB, newTagName)) {
      return false
    }
    if (newTagName?.tagName?.trim() == '') {
      return false
    }
    return true
  }



  /**
   * Calls the updatefunction for database update 
   * @param tags 
   * @param newTagName 
   */
  async updateDBTagName(tags: tags[], newTagName: Partial<{
    tagName: string | null;
  }>) {
    const relevantTag = tags.filter((tag) => tag.tag == this.tagNameBeforeEdit() && this.userId() == tag.userId)
    const tagId = relevantTag[0].id
    const newTag = String(newTagName.tagName)
    await this.db.editCustomTag(tagId, newTag)
  }

/**
 * 
 * @param newTag 
 */
  async updateTagsInEntries(newTag: Partial<{
    tagName: string | null;
  }>) {
    await this.getEntriesWithToChangeTag()
    this.changeTagName(newTag)
    this.toUpdateEntries().forEach((entry) => {
      this.db.updateTagKnowledgeEntry(entry)
    });
  }
  
  /**
   * Function helper for Tagname change
   * It filters all neccessary entries, its tags need to be changed
   */
  async getEntriesWithToChangeTag() {
    let tempEntries = [] as KnowledgeEntry[]
    const entries = await this.db.readKnowledgeEntries() as KnowledgeEntry[]
    entries.filter(entry => {
      if (entry.tags.includes(this.tagNameBeforeEdit()) && this.userId() == entry.userId) {
        tempEntries.push(entry)
      }
    })
    if (tempEntries.length > 0) {
      this.toUpdateEntries.set(tempEntries)
    }
  }

  /**
   * Creates a copy of toUpdateEntries()
   * Updates the copy edited tagname, for all affected entries
   * @param newTag 
   */
  changeTagName(newTag: Partial<{
    tagName: string | null;
  }>) {
    this.toUpdateEntries.update((entries) => entries.map(entry => ({
      ...entry,
      tags: entry.tags.map(tag =>
        tag == this.tagNameBeforeEdit() ? String(newTag.tagName) : tag
      )
    })));
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
