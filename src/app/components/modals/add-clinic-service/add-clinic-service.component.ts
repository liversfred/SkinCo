import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileExtension } from 'src/app/constants/file-extension.constants';
import { FormConstants } from 'src/app/constants/form.constants';
import { ClinicServiceData } from 'src/app/models/clinic-service-data.model';
import { GlobalService } from 'src/app/services/global.service';
import { priceValidator } from 'src/app/validators/price-validator.directive';

@Component({
  selector: 'app-add-clinic-service',
  templateUrl: './add-clinic-service.component.html',
  styleUrls: ['./add-clinic-service.component.scss'],
})
export class AddClinicServiceComponent  implements OnInit {
  @Input() data: any;
  clinicServiceForm: FormGroup | undefined;
  file: File | undefined;
  imageExtensions: string = FileExtension.IMAGE;
  serviceNameMaxLength: number = FormConstants.serviceNameMaxLength;
  serviceDescriptionMaxLength: number = FormConstants.serviceDescriptionMaxLength;
  servicePriceMax: number = FormConstants.servicePriceMax;

  constructor( private _globalService: GlobalService) { }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup(){
    this.clinicServiceForm = new FormGroup({
      name: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.serviceNameMaxLength)] }),
      description: new FormControl('', { validators: [Validators.maxLength(this.serviceDescriptionMaxLength)] }),
      price: new FormControl(null, { validators: [Validators.required, Validators.max(this.servicePriceMax), priceValidator.bind(this)] }),
    });

    if(this.data?.clinicService) {
      const clinicService: ClinicServiceData = this.data.clinicService;
      this.clinicServiceForm?.get('name')?.setValue(clinicService.name);
      this.clinicServiceForm?.get('description')?.setValue(clinicService.description);
      this.clinicServiceForm?.get('price')?.setValue(clinicService.price);
    }
  }
  
  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    if(this.clinicServiceForm?.invalid) {
      this._globalService.showCloseAlert("Please fill in all the fields.");
      return;
    }

    const clinicService: any = {
      name: this.clinicServiceForm?.value.name.trim(),
      description: this.clinicServiceForm?.value.description.trim(),
      price: this.clinicServiceForm?.value.price,
      image: this.file
    } 
    
    this.dismiss(clinicService);
  }

  async onImageUpload(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      this._globalService.showToast('Invalid file.');
      return;
    }

    this.file = file;
  }
}
