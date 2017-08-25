import { Pipe, PipeTransform, enableProdMode } from '@angular/core';
import moment from 'moment';

/**
 * Generated class for the MesesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'meses',
})
export class MesesPipe implements PipeTransform {
  transform(value: number) {
    if(value!=undefined && value!=null){
      return moment.months(value);
    }else{
      return "Sin Mes";
    }
  }
}
