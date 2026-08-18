import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TableRow } from '../../../interfaces/table-row';
import { FormModel } from '../../../models/form-model';
import { Supabase } from '../../../services/supabase';
import { ScreenshotUploadArea } from '../../../components/screenshot-upload-area/screenshot-upload-area';
import { JsonPipe } from '@angular/common';
import { Forms } from '../../../services/forms';

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
    let data = new FormModel(this.forms.surveyForm.value as Partial<TableRow>)
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
