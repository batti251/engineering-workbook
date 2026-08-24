import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KnowledgeEntryData } from '../../../../shared/interfaces/knowledge-entry-data';
import { KnowledgeEntry } from '../../../../shared/models/knowledge-entry';
import { Supabase } from '../../../../core/supabase';
import { ScreenshotUploadArea } from '../../../../shared/components/screenshot-upload-area/screenshot-upload-area';
import { JsonPipe } from '@angular/common';
import { Forms } from '../../../../shared/services/forms';

@Component({
  selector: 'app-coding-add',
  imports: [ReactiveFormsModule, ScreenshotUploadArea, JsonPipe],
  templateUrl: './coding-add.html',
  styleUrl: './coding-add.scss',
})
export class CodingAdd {
  db = inject(Supabase)
  forms = inject(Forms)

  
  async sendDataToDB() {
    await this.forms.addScreenshotsToDB()
    let data = new KnowledgeEntry(this.forms.surveyForm.value as Partial<KnowledgeEntryData>)
    try {
      this.db.isRowAdded = await this.db.addRow(data)
      if (this.db.checkDBHandling()) {
        this.refreshComponent()
      }
    } catch (error) {
    }
  }

  refreshComponent() {
    window.location.reload()
  }
}
