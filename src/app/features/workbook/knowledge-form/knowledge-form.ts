import { Component, computed, ElementRef, HostListener, inject, signal, ViewChild, ViewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KnowledgeEntryData } from '../../../shared/interfaces/knowledge-entry-data';
import { KnowledgeEntry } from '../../../shared/models/knowledge-entry';
import { Supabase } from '../../../core/db';
import { JsonPipe } from '@angular/common';
import { Forms } from '../../../shared/services/forms';
import { Clipboard } from '../../../core/clipboard';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Keys } from '../../../shared/services/key';
import { Storage } from '../../../core/storage';
import { Select } from './select/select';
import { Links } from './links/links';
import { Screenshot } from './screenshot/screenshot';
import { ConfirmDialog } from "./confirm-dialog/confirm-dialog";
import { InfoDialog } from './info-dialog/info-dialog';
import { Auth } from '../../../core/auth';


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
  imports: [ReactiveFormsModule, JsonPipe, Select, Links, Screenshot, ConfirmDialog, InfoDialog, RouterLink],
  templateUrl: './knowledge-form.html',
  styleUrl: './knowledge-form.scss',
  providers: [Forms, Select]
})
export class KnowledgeForm {
  db = inject(Supabase)
  forms = inject(Forms)
  clipboard = inject(Clipboard)
  key = inject(Keys)
  storage = inject(Storage)
  router = inject(Router)
  auth = inject(Auth)


  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data
  });
  private entry = computed(() => this.data()['entry']);
  error = signal<any>({})
  isEditForm = signal(false)

  isSticky = false;
  formSubmit = signal(false)

  @ViewChild(InfoDialog)
  infoDialog!: InfoDialog;

  @ViewChild(ConfirmDialog)
  confirmDialog!: ConfirmDialog;

  @ViewChild('sticky')
  sticky!: ElementRef<HTMLElement>

  @HostListener('window:scroll')
  onScroll(): void {
    this.checkSticky();
  }

  checkSticky(): void {
    const element = this.sticky.nativeElement;
    const rect = element.getBoundingClientRect();
    this.isSticky = rect.top <= 0;
    if (this.isSticky) {
      element.classList.add('sticky')
    } else element.classList.remove('sticky')
  }

  ngOnInit() {
    this.initFormBuild()
  }

  /**
   * Handler to create a form according to the signal entry()
   * Sets a flag according to the signals data 
   * @returns 
   */
  initFormBuild(): void {
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
  buildEditForm(data: KnowledgeEntryData): void {
    this.forms.buildEditForm(data)
  }

  /**
   * initiates to build a new form for a new entry 
   */
  buildNewForm(): void {
    this.forms.buildNewForm()
  }

  /**
   * Validates if the User is permitted to enter the confirm Dialog to delete Entry
   * @returns 
   */
  async deleteEntry(): Promise<void> {
    if (!await this.isValidUser()) return;
    this.confirmDialog.open()
  }

  /**
   * Validates and performs Add/Update Function to DB, after passing all conditions
   * conditions: - the user needs permission 
   *             - form needs to be valid
   * @returns 
   */
  async sendDataToDB(): Promise<void> {
    this.formSubmit.set(true)
    if (!await this.isValidUser()) return;
    if (!this.formIsValid()) return;
    let data = new KnowledgeEntry(this.forms.entryForm.value as Partial<KnowledgeEntryData>)
    this.isEditForm() ? this.tryUpdateData(data) : this.tryAddNewData(data);
  }

  /**
   * Performs a request, if the user is permitted to change data entries
   * User, who are not logged in, are not allowed to change data entries 
   * @returns - 
   */
  async isValidUser(): Promise<boolean> {
    let error = await this.auth.getUser()
    console.log(error);
    if (error !== 200) {
      this.error.set(error)
      this.infoDialog.open()
      return false
    } else {
      this.error.set(200)
      return true
    }
  }

  /**
   * Searchs for invalid Inputs and scrolls into it
   * Indicates form as valid, when no invalid Inputs found 
   * @returns 
   */
  formIsValid(): boolean {
    let invalidSection = document.querySelector('section')
    let invalidInput = invalidSection?.querySelector<HTMLElement>('.ng-invalid')
    if (invalidInput) {
      invalidInput?.scrollIntoView()
      invalidInput?.focus()
      return false
    } return true
  }

  /**
   * Performs entryData update Function to database
   * If an error is catched, a dialog will sho up, with the thrown error
   * @param data - the filled form by the user
   */
  async tryUpdateData(data: KnowledgeEntryData): Promise<void> {
    try {
      await this.updateEntry(data);
      await this.forms.sendScreenshotsToDB()
      this.infoDialog.open()
      this.redirectToDoc()
    } catch (error) {
      if (error instanceof Error) {
        this.error.set(error)
        this.infoDialog.open()
      }
    }
  }

  /**
   * Performs entryData add Function to database
   * If an error is catched, a dialog will sho up, with the thrown error
   * @param data - the filled form by the user
   */
  async tryAddNewData(data: KnowledgeEntryData): Promise<void> {
    try {
      await this.db.createNewKnowledgeEntry(data)
      this.infoDialog.open()
      this.redirectToDoc()
    } catch (error) {
      if (error instanceof Error) {
        this.error.set(error)
        this.infoDialog.open()
      }
    }
  }

  /**
   * Executes Database and storage update functions
   * @param data - the submitted form data
   */
  async updateEntry(data: KnowledgeEntryData): Promise<void> {
    await this.db.updateKnowledgeEntry(data)
    this.db.toDeleteDBFiles.forEach(async file => {
      await this.storage.deleteFile(file)
    })
  }

  /**
   * redirects the user to the knowledge documentation page
   */
  redirectToDoc(): void {
    setTimeout(() => {
      this.router.navigateByUrl('/knowledge/doc')
    }, 2000);
  }

  @ViewChild('menu')
  menu!: ElementRef<HTMLElement>

  @ViewChild('menuBtn')
  menuBtn!: ElementRef<HTMLElement>

  toggleMenu(event: PointerEvent):void {
    let clickTarget = event.target
    let menuBtn = this.menuBtn.nativeElement
    clickTarget == menuBtn ? this.menu.nativeElement.classList.toggle('open') : this.menu.nativeElement.classList.remove('open')
  }
}
