import { NgModule } from '@angular/core';
import { TemplatePageRoutingModule } from './template-routing.module';

import { TemplatePage } from './template.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClinicModule } from 'src/app/components/clinic/clinic.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { TemplateModule } from 'src/app/components/template/template.module';

@NgModule({
  imports: [
    SharedModule,
    ClinicModule,
    ComponentsModule,
    TemplateModule,
    TemplatePageRoutingModule
  ],
  declarations: [TemplatePage]
})
export class TemplatePageModule {}
