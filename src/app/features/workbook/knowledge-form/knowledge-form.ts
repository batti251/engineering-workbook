import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KnowledgeEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { KnowledgeEntry } from '../../../shared/models/knowledge-entry';
import { Supabase } from '../../../core/supabase';
import { JsonPipe } from '@angular/common';
import { Forms } from '../../../shared/services/forms';
import { Clipboard } from '../../../core/clipboard';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Keys } from '../../../shared/services/key';


export const entryResolver: ResolveFn<KnowledgeEntryData[] | null> = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const entry = inject(Supabase);
  const entryId = route.paramMap.get('id')!;
  return await entry.readDBEntry(entryId);
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
  router = inject(Router)

  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data
  });
  entry = computed(() => this.data()['entry']);

  isEditForm = false

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
      this.isEditForm = true
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
    await this.forms.addScreenshotsToDB(this.isEditForm)
    let data = new KnowledgeEntry(this.forms.entryForm.value as Partial<KnowledgeEntryData>)
     try {
      if (this.isEditForm) {
        this.db.isRowUpdated = await this.db.updateRow(data)
        this.db.isFileDeleted = await this.db.deleteFile(this.db.toDeleteDBFiles)
        if (this.db.checkDBHandling()) {
          this.redirectToDoc()
        }
      } else {
        this.db.isRowAdded = await this.db.addRow(data)
        if (this.db.checkDBHandling()) {
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
