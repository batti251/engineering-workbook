import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KnowledgeEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { KnowledgeEntry } from '../../../shared/models/knowledge-entry';
import { Supabase } from '../../../core/supabase';
import { JsonPipe } from '@angular/common';
import { Forms } from '../../../shared/services/forms';
import { Clipboard } from '../../../core/clipboard';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
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

  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data
  });
  entry = computed(() => this.data()['entry']);

  isEditForm = false

  ngOnInit() {
    this.initFormBuild()
  }

  initFormBuild() {
    if (this?.entry()) {
      this.isEditForm = true

      let data = this?.entry()[0] as KnowledgeEntryData

      if (data) {
        this.buildEditForm(data)
        return
      } else {
        console.log("2");

        this.buildNewForm()
      }
    }
  }


  buildEditForm(data: KnowledgeEntryData) {
    this.forms.buildEditForm(data)
  }

  buildNewForm() {
    this.forms.buildNewForm()
  }



  async sendDataToDB() {
    await this.forms.addScreenshotsToDB(this.isEditForm)
    let data = new KnowledgeEntry(this.forms.entryForm.value as Partial<KnowledgeEntryData>)
    console.log(data);
    
     try {
      if (this.isEditForm) {
        this.db.isRowUpdated = await this.db.updateRow(data)
        this.db.isFileDeleted = await this.db.deleteFile(this.db.toDeleteDBFiles)
        if (this.db.checkDBHandling()) {
          this.refreshComponent()
        }
      } else {
        this.db.isRowAdded = await this.db.addRow(data)
        if (this.db.checkDBHandling()) {
          this.refreshComponent()
        }
      }

    } catch (error) {
    }
  }

  refreshComponent() {
    window.location.reload()
  }
}
