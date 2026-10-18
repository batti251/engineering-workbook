import { Directive, ElementRef, inject, Signal } from '@angular/core';

@Directive({
  selector: '[appStickyNavbar]',
  host: {
    '(window:scroll)': 'onScroll()',
    '(window:resize)': 'resetUI()'
  }
})
export class StickyNavbar {
  private sticky = inject(ElementRef)
  private lastScroll = window.scrollY
  private scrollsTop = false
  private mobileBreakpoint = 768
  private isMobileScreen = false


  resetUI() {
    this.scanDeviceScreen()
    if (!this.isMobileScreen) {
      this.sticky.nativeElement.classList.remove('sticky-scroll')
      this.sticky.nativeElement.classList.remove('is-scrolling')
    }
  }

  onScroll(): void {
    this.scanDeviceScreen()
    this.showNavbar()

    if (this.isMobileScreen) {
      this.addScrollingState()
      this.scanScrollTop()
    }
  }

  scanScrollTop() {
    const currentScroll = window.scrollY
    this.scrollsTop = currentScroll < this.lastScroll
    this.lastScroll = currentScroll
  }


  showNavbar() {
    let screenSize = window.innerWidth
    if (screenSize > this.mobileBreakpoint) return
    if (screenSize < this.mobileBreakpoint && this.scrollsTop) {
      this.sticky.nativeElement.classList.add('sticky-scroll')
    } else {
      this.sticky.nativeElement.classList.remove('sticky-scroll')
    }
  }

  addScrollingState() {
    if (this.sticky.nativeElement.getBoundingClientRect().top == 0) {
      this.sticky.nativeElement.classList.add('is-scrolling')

    } else {
      this.sticky.nativeElement.classList.remove('is-scrolling')
    }
  }



  scanDeviceScreen() {
    if (this.mobileBreakpoint > window.innerWidth) {
      this.isMobileScreen = true
    } else this.isMobileScreen = false
  }

}
