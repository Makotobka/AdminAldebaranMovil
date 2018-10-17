import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the RedondearPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'redondear',
})
export class RedondearPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number) {
    if(value!=undefined && value!=null){
      let text=value.toString();
      let numAux = Math.round(value * 100) / 100;
      //console.log(text);
      if(text.split(".").length>=2){
        if(text.split(".")[1].length>=2){        
          return numAux;
        }else{
          return text+="0";
        }
      }else{
        return text+=".00";
      }      
    }else{
      return 0.00;
    }
  }
}
