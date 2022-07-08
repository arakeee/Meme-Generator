import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneratorRoutingModule } from './generator-routing.module';
import { GeneratorComponent } from './components/generator/generator.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {ReactiveFormsModule} from "@angular/forms";
import { DownloadFileDirective } from './directives/download-file.directive';

@NgModule({
  declarations: [GeneratorComponent, DownloadFileDirective],
  imports: [CommonModule, GeneratorRoutingModule, FontAwesomeModule, ReactiveFormsModule],
})
export class GeneratorModule {}
