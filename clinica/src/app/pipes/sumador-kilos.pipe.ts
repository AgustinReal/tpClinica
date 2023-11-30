import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumadorKilos'
})
export class SumadorKilosPipe implements PipeTransform {

  transform(peso: string, sumKilos: number): string {

    return  (parseInt(peso) + sumKilos).toString();
  }

}
