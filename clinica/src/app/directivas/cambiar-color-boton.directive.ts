import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCambiarColorBoton]'
})
export class CambiarColorBotonDirective {
  @Input('appCambiarColorBoton') nuevoColor: string = 'red'; // Color por defecto

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.cambiarColor(this.nuevoColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.cambiarColor(null);
  }

  private cambiarColor(color: string | null) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}