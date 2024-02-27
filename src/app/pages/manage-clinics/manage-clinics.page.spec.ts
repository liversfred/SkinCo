import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageClinicsPage } from './manage-clinics.page';

describe('ManageClinicsPage', () => {
  let component: ManageClinicsPage;
  let fixture: ComponentFixture<ManageClinicsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManageClinicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
