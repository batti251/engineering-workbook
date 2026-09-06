import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { Login } from '../../../home/login/login';
import { Supabase } from '../../../../core/db';
import { Forms } from '../../../../shared/services/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { routes } from '../../../../app.routes';
import { PostgrestError } from '@supabase/supabase-js';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  db = inject(Supabase)
  form = inject(Forms)
  @ViewChild('dialog')
  private dialog!: ElementRef<HTMLDialogElement>
  private router = inject(Router)
  message = signal<string>('');
  isError = signal(false);
  isConfirmed = signal(false);

  open() {
    this.dialog.nativeElement.showModal()
  }

  close() {
    this.dialog.nativeElement.close();
    this.isError.set(false);
    this.message.set('')
  }

  /**
   * Deletes the given Entry from the Database
   */
  async confirmDelete() {
    this.isError.set(false)
    this.isConfirmed.set(true)
    try {
      await this.db.deleteKnowledgeEntry(this.form.entryForm.get('id')!.value!);
      this.message.set('Eintrag gelöscht! Sie werden zur Hauptseite geleitet')
      this.redirectToDoc()
    } catch (error) {
      this.isError.set(true)
      if (error instanceof Error) {
        this.message.set(error.message)
      }
    }
  }


  /**
 * redirects the user to the knowledge documentation page
 * Redirects after 1.5 seconds
 */
  redirectToDoc() {
    setTimeout(() => {
      this.router.navigateByUrl('/knowledge/doc')
    }, 2000);
  }
}
