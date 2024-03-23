import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookingStatus } from 'src/app/constants/booking-status.enum';
import { FilterTypeEnum } from 'src/app/constants/filter-type.enum';
import { Clinic } from 'src/app/models/clinic.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Input() filterOptions: string[] = [];
  @Input() clinicOptions: Clinic[] = [];
  statusOptions: string[] = Object.values(BookingStatus);
  filterTypes: any = FilterTypeEnum;
  filterType: FilterTypeEnum | null = null;
  dateFilterValue: string | undefined;
  @Output() filterByDate = new EventEmitter<Date>;
  @Output() filterByClinic = new EventEmitter<Clinic>;
  @Output() filterByStatus = new EventEmitter<BookingStatus>;
  @Output() clearFilters = new EventEmitter<void>;

  constructor() { }

  onChangeFilterType(filterType?: FilterTypeEnum){
    this.filterType = filterType ?? null;

    if(!this.filterType) {
      this.clearFilters.emit();
      return;
    }
    else if(this.filterType === FilterTypeEnum.TODAY){
      this.onTodayFilter();
    }
  }

  onTodayFilter(){
    this.filterByDate.emit(new Date());
    this.filterType = null;
  }

  onDateFilterChange(event: any){
    const dateSelected = event.target.value;
    this.filterByDate.emit(new Date(dateSelected));
    this.filterType = null;
  }

  onClinicFilterChange(event: any){
    const clinicIdSelected = event.target.value;
    const clinic = this.clinicOptions.find(x => x.id === clinicIdSelected);
    this.filterByClinic.emit(clinic);
    this.filterType = null;
  }

  onStatusFilterChange(event: any){
    const bookingStatusSelected = event.target.value as BookingStatus;
    this.filterByStatus.emit(bookingStatusSelected);
    this.filterType = null;
  }
}
