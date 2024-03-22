import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePatientPage } from './home-patient.page';

describe('HomePatientPage', () => {
  let component: HomePatientPage;
  let fixture: ComponentFixture<HomePatientPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomePatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
