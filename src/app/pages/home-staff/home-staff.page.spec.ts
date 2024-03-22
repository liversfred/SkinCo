import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeStaffPage } from './home-staff.page';

describe('HomeStaffPage', () => {
  let component: HomeStaffPage;
  let fixture: ComponentFixture<HomeStaffPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeStaffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
