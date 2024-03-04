import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Doctor } from 'src/app/models/doctor.model';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.scss'],
})
export class DoctorCardComponent implements OnInit{
  @Input() doctor: Doctor | undefined;
  @Output() updateDoctor = new EventEmitter<void>;
  imagePath: string = "";

  constructor() { }

  ngOnInit(): void {
    this.imagePath = `../../../assets/images/doctors/${this.doctor?.person.gender.toLocaleLowerCase()}-doctor.png`;
  }

  onUpdateDoctor(){
    this.updateDoctor.emit();
  }
}
