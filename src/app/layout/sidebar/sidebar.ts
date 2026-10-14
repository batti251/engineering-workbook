import { Component, effect, ElementRef, EventEmitter, inject, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @ViewChildren('link')
  link!: QueryList<ElementRef<HTMLElement>>

  auth = inject(Auth)
  isValidUser = signal(false)
  isActive = signal(false)
  dockSidebar = false
  @Output() isSticky = new EventEmitter<boolean>()

  async ngOnInit(){
    const isValidUser = await this.auth.isValidUser();
    this.isValidUser.update(() => isValidUser)
  }

  constructor(){
    effect(async () => {
      this.auth.isActiveSession()
    })
  }

  /**
   * toggles docked sidebar and emits status
   * @returns 
   */
  toggleSticky(): void {
    if (this.dockSidebar == false) {
      this.dockSidebar = true
    } else {
      this.dockSidebar = false
    }
    return this.isSticky.emit(this.dockSidebar)
  }

  toggleState(index: number) {
    this.link.forEach(element => {
      element.nativeElement.classList.remove('active')
    })
    let target = this.link.get(index)
    target?.nativeElement.classList.add('active')
    this.isActive.set(true)
  }
}
