import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicBankDetailsPage } from './clinic-bank-details.page';

describe('ClinicBankDetailsPage', () => {
  let component: ClinicBankDetailsPage;
  let fixture: ComponentFixture<ClinicBankDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClinicBankDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
