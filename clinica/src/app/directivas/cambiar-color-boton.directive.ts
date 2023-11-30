import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCambiarColorBoton]'
})
export class CambiarColorBotonDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.changeColor('yellow'); 
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.changeColor('white');
  }

  private changeColor(color: string) {
    this.el.nativeElement.style.color = color;
  }
}