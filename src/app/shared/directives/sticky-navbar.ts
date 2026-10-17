import { Directive, ElementRef, inject, Signal } from '@angular/core';

@Directive({
  selector: '[appStickyNavbar]',
  host: { '(window:scroll)': 'onScroll()' }
})
export class StickyNavbar {
  private sticky = inject(ElementRef)
  private lastScroll = window.scrollY
  private scrollsTop = false
  private mobileBreakpoint= 768

  onScroll(): void {
    const currentScroll = window.scrollY
    this.scrollsTop = currentScroll < this.lastScroll
    this.lastScroll = currentScroll

    let screenSize = window.innerWidth
    if (screenSize > this.mobileBreakpoint) return
    if (screenSize < this.mobileBreakpoint && this.scrollsTop) {
      this.sticky.nativeElement.classList.add('sticky-scroll')
      this.sticky.nativeElement.classList.remove('scroll-down')
    } else {
      this.sticky.nativeElement.classList.remove('sticky-scroll')
      this.sticky.nativeElement.classList.add('scroll-down')
    }
  }

}
