import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appAgrandarLetra]'
})
export class AgrandarLetraDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.cambiarTamanoLetra('2rem');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.cambiarTamanoLetra('1rem');
  }

  private cambiarTamanoLetra(tamano: string) {
    this.renderer.setStyle(this.el.nativeElement, 'font-size', tamano);
  }

}
