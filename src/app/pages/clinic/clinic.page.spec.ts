import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicPage } from './clinic.page';

describe('ClinicPage', () => {
  let component: ClinicPage;
  let fixture: ComponentFixture<ClinicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClinicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
