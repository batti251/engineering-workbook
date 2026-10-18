import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appStickyHeader]',
  host: {
    '(window:scroll)': 'onScroll()',
    '(window:resize)': 'resetUI()',
  }
})
export class StickyHeader {
  private sticky = inject(ElementRef)
  private lastScroll = window.scrollY
  private scrollsTop = false
  private mobileBreakpoint = 768
  private isMobileScreen = false

  resetUI() {
    this.scanDeviceScreen()
    if (!this.isMobileScreen) {
      this.sticky.nativeElement.classList.remove('sticky')
      this.sticky.nativeElement.classList.remove('sub-header--move')
    }
  }


  onScroll(): void {
    this.scanScrollTop()
    this.scanDeviceScreen()
    this.toggleSticky()
    this.moveSubHeader()
  }

  scanScrollTop() {
    const currentScroll = window.scrollY
    this.scrollsTop = currentScroll < this.lastScroll
    this.lastScroll = currentScroll
  }

  toggleSticky() {
    if (window.innerWidth < this.mobileBreakpoint) {
      this.sticky.nativeElement.classList.add('sticky')
    } else {
      this.sticky.nativeElement.classList.remove('sticky')
    }
  }

  moveSubHeader() {
    if (this.scrollsTop && this.isMobileScreen) {
      this.sticky.nativeElement.classList.add('sub-header--move')
    } else this.sticky.nativeElement.classList.remove('sub-header--move')
  }

  scanDeviceScreen() {
    if (this.mobileBreakpoint < window.innerWidth) {
      this.isMobileScreen = false
    } else this.isMobileScreen = true
  }
}