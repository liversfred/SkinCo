import { NgModule } from '@angular/core';
import { TemplateAccordionComponent } from './template-accordion/template-accordion.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TemplateAccordionComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    TemplateAccordionComponent
  ]
})
export class TemplateModule { }
