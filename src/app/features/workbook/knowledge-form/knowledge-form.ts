import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KnowledgeEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { KnowledgeEntry } from '../../../shared/models/knowledge-entry';
import { Supabase } from '../../../core/db';
import { JsonPipe } from '@angular/common';
import { Forms } from '../../../shared/services/forms';
import { Clipboard } from '../../../core/clipboard';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Keys } from '../../../shared/services/key';
import { Storage } from '../../../core/storage';


export const entryResolver: ResolveFn<KnowledgeEntryData[] | null> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const entry = inject(Supabase);
  const entryId = route.paramMap.get('id')!;
  return await entry.readSingleKnowledgeEntry(entryId);
}


@Component({
  selector: 'app-coding-add',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './knowledge-form.html',
  styleUrl: './knowledge-form.scss',
  providers: [Forms]
})
export class KnowledgeForm {
  db = inject(Supabase)
  forms = inject(Forms)
  clipboard = inject(Clipboard)
  key = inject(Keys)
  storage = inject(Storage)
  router = inject(Router)

  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data
  });
  private entry = computed(() => this.data()['entry']);

  private isEditForm = signal(false)

  ngOnInit() {
    this.initFormBuild()
  }

  /**
   * Handler to create a form according to the signal entry()
   * Sets a flag according to the signals data 
   * @returns 
   */
  initFormBuild():void {
    if (this?.entry()) {
      this.isEditForm.update(() => true)
      let data = this?.entry()[0] as KnowledgeEntryData
      if (data) {
        this.buildEditForm(data)
        return
      } else {
        this.buildNewForm()
      }
    }
  }

  /**
   * initiates to build a edit-form
   * it will allow the user to edit the current @param data entry
   * @param data - the single entry data, to edit
   */
  buildEditForm(data: KnowledgeEntryData):void {
    this.forms.buildEditForm(data)
  }

  /**
   * initiates to build a new form for a new entry 
   */
  buildNewForm():void {
    this.forms.buildNewForm()
  }

  async sendDataToDB():Promise<void> {
    await this.forms.sendScreenshotsToDB()
    let data = new KnowledgeEntry(this.forms.entryForm.value as Partial<KnowledgeEntryData>)
     try {
      if (this.isEditForm()) {
        let databaseSuccess = await this.db.updateKnowledgeEntry(data)
        let storageSuccess = this.db.toDeleteDBFiles.forEach(async file => {
          await this.storage.deleteFile(file)
        }) 
        if (databaseSuccess && storageSuccess) {
          this.redirectToDoc()
        }
      } else {
        let databaseSuccess = await this.db.createNewKnowledgeEntry(data)
        if (databaseSuccess) {
          this.redirectToDoc()
        }
      }
    } catch (error) {
    }
  }

  /**
   * redirects the user to the knowledge documentation page
   */
  redirectToDoc() {
    this.router.navigateByUrl('/knowledge/doc')
  }
}
