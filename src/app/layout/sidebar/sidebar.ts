import { Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @ViewChildren('link')
  link!: QueryList<ElementRef<HTMLElement>>


  isActive = signal(false)

  toggleState(index: number) {
    this.link.forEach(element => {
      element.nativeElement.classList.remove('active')
    })
    let target = this.link.get(index)
    console.log();
    target?.nativeElement.classList.add('active')
    this.isActive.set(true)
  }
}
