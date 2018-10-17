import { BrowserModule } from '@angular/platform-browser';
import { CustomFormsModule } from 'ng2-validation'
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { RedondearPipe } from '../pipes/redondear/redondear';
import { PipesModule } from '../pipes/pipes.module';

export const importaciones = [
    BrowserModule,
    CustomFormsModule,
    HttpModule,
    FormsModule,
    ChartsModule,
    PipesModule
]