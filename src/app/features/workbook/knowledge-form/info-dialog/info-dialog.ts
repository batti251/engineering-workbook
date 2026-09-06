import { afterRenderEffect, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-info-dialog',
  imports: [],
  templateUrl: './info-dialog.html',
  styleUrl: './info-dialog.scss',
})
export class InfoDialog {
  @ViewChild('infoDialog')
  infoDialog!: ElementRef<HTMLDialogElement>

  @Input() message: any = ''

  errorMessage: Record<string, string> = {
    'Error: 42501': "Keine Berechtigung Inhalt zu erstellen",
    '400': "Als Gast dürfen Sie keine Einträge ändern",
    'Error: PGRST205': "Tabelle existiert nicht. Bitte an Entwickler wenden",
    '200': "Upload erfolgreich!"
  }

  close() {
    this.infoDialog.nativeElement.close()
  }

  open() {
    this.infoDialog.nativeElement.showModal()
  }

}
