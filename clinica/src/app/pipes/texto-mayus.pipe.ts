import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textoMayus'
})
export class TextoMayusPipe implements PipeTransform {

  transform(value: string): string {
    if(value == "")
    {
      return "";
    }
    return value.toUpperCase();
  }

}
