import { NgModule } from '@angular/core';
import { RedondearPipe } from './redondear/redondear';
import { MesesPipe } from './meses/meses';
@NgModule({
	declarations: [RedondearPipe,
    MesesPipe],
	imports: [],
	exports: [RedondearPipe,
    MesesPipe]
})
export class PipesModule {}
