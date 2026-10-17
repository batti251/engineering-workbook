import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appStickyHeader]',
  host: {
    '(window:scroll)': 'onScroll()',
  }
})
export class StickyHeader {

  isSticky = false;

  private sticky = inject(ElementRef)
  private lastScroll = window.scrollY
  private scrollsTop = false
  private mobileBreakpoint = 768

  onScroll(): void {
    const currentScroll = window.scrollY
    this.scrollsTop = currentScroll < this.lastScroll
    this.lastScroll = currentScroll

    let screenSize = window.innerWidth
    if (screenSize < this.mobileBreakpoint) {
      this.sticky.nativeElement.classList.add('sticky')
    } else this.sticky.nativeElement.classList.remove('sticky')
    this.addTop()
  }

  addTop() {
    let screenSize = window.innerWidth
    if (this.scrollsTop && screenSize < this.mobileBreakpoint) {
      this.sticky.nativeElement.style.top = "50px"
    } else this.sticky.nativeElement.style.top = "0"
  }

}