import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClinicRegistrationFormComponent } from './clinic-registration-form.component';

describe('ClinicRegistrationFormComponent', () => {
  let component: ClinicRegistrationFormComponent;
  let fixture: ComponentFixture<ClinicRegistrationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicRegistrationFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
