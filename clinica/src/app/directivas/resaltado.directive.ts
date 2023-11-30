import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appResaltado]'
})
export class ResaltadoDirective {
  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltar(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resaltar(false);
  }

  private resaltar(estado: boolean) {
    if (estado) {
      this.el.nativeElement.style.backgroundColor = 'yellow';
    } else {
      this.el.nativeElement.style.backgroundColor = null;
    }
  }
  

}
