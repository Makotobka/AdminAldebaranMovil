import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RedondearEnterosPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'redondearEnteros',
})
export class RedondearEnterosPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number) {
    if(value!=undefined && value!=null){
      let text=value.toString();
      let numAux = Math.round(value * 100) / 100;  
      return text.split('.')[0];
    }else{
      return 0;
    }
  }
}
