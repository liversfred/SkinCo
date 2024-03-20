import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterTypeEnum } from 'src/app/constants/filter-type.enum';
import { Clinic } from 'src/app/models/clinic.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Input() clinicOptions: Clinic[] = [];
  filterTypes: any = FilterTypeEnum;
  filterType: FilterTypeEnum | null = null;
  dateFilterValue: string | undefined;
  selectedClinicId: string | undefined;
  @Output() filterByDate = new EventEmitter<Date>;
  @Output() filterByClinic = new EventEmitter<string>;
  @Output() clearFilters = new EventEmitter<void>;

  constructor() { }

  onChangeFilterType(filterType?: FilterTypeEnum){
    this.filterType = filterType ?? null;

    if(!this.filterType) {
      this.clearFilters.emit();
      return;
    };
  }

  onDateFilterChange(event: any){
    const dateSelected = event.target.value;
    this.filterByDate.emit(new Date(dateSelected));
    this.filterType = null;
  }

  onClinicFilterChange(event: any){
    const clinicIdSelected = event.target.value;
    this.filterByClinic.emit(clinicIdSelected);
    this.filterType = null;
  }
}
