import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-overflow-menu',
  imports: [RouterLink],
  templateUrl: './overflow-menu.html',
  styleUrl: './overflow-menu.scss',
})
export class OverflowMenu {
  @Output() toDelete = new EventEmitter<boolean>()
  @Input() showMenu: boolean = false

  sendDeleteEmitter(){
    return this.toDelete.emit(true)
  }



}
