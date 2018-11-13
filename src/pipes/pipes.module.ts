import { NgModule } from '@angular/core';
import { RedondearPipe } from './redondear/redondear';
import { MesesPipe } from './meses/meses';
import { RedondearEnterosPipe } from './redondear-enteros/redondear-enteros';
@NgModule({
	declarations: [RedondearPipe,
    MesesPipe,
    RedondearEnterosPipe],
	imports: [],
	exports: [RedondearPipe,
    MesesPipe,
    RedondearEnterosPipe]
})
export class PipesModule {}
