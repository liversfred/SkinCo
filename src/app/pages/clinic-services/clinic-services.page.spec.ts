import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicServicesPage } from './clinic-services.page';

describe('ClinicServicesPage', () => {
  let component: ClinicServicesPage;
  let fixture: ComponentFixture<ClinicServicesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClinicServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
