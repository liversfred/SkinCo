import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TemplateDefault } from 'src/app/constants/template-dafault.constants';
import { Template } from 'src/app/models/template.model';

@Component({
  selector: 'app-template-accordion',
  templateUrl: './template-accordion.component.html',
  styleUrls: ['./template-accordion.component.scss'],
})
export class TemplateAccordionComponent implements OnInit {
  @Input() template: Template | undefined;
  templateForm: FormGroup | undefined;
  templateDefault: any = TemplateDefault;
  errorMessage: string = '';
  @Output() updateTemplate = new EventEmitter<Template>;

  constructor() { }

  ngOnInit(): void {
    this.initializeFormGroup();
  }

  initializeFormGroup(){
    this.templateForm = new FormGroup({
      content: new FormControl(this.template?.content, { validators: [Validators.required] }),
    });
  }

  onUpdateTemplate(){
    const template: Template = {
      ...this.template!,
      content: this.templateForm?.value.content
    }
    this.updateTemplate.emit(template);
  }

  validateEmailContent(event: any){
    const constainsAllVars = event.includes(TemplateDefault.CLINIC_NAME_VAR) &&
                            event.includes(TemplateDefault.BOOKING_DETAILS_VAR) &&
                            event.includes(TemplateDefault.SERVICES_VAR) 
    this.errorMessage = '';

    if(!constainsAllVars){
      this.errorMessage = `${TemplateDefault.CLINIC_NAME_VAR}, ${TemplateDefault.BOOKING_DETAILS_VAR}, ${TemplateDefault.SERVICES_VAR} are all required.`;
    }
  }
}
