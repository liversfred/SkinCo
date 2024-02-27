import { Injectable } from '@angular/core';
import { TrailService } from '../trail.service';
import { Collections } from 'src/app/constants/collections.constants';
import { CollectionReference, DocumentData, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Clinic } from 'src/app/models/clinic.model';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';

@Injectable({
  providedIn: 'root'
})
export class ClinicSeederService {
  private collection: CollectionReference<DocumentData>;

  constructor(private _fireStore: Firestore, private _trailService: TrailService) {
    this.collection = collection(this._fireStore, Collections.CLINICS);
  }

  async seedData() {
    const dataToSeed: Clinic[] = [
      { 
        name: "Clinic A",
        location: {
          initial: 'FXRC+2PW',
          address: 'FXRC+2PW, Mabini Street Extension, Cabanatuan City, Nueva Ecija',
          lat: 15.49021815369733,
          lng: 120.97180536703239,
          addressNo: '1A',
          landmark: 'PJG Hospital'
        },
        telephoneNumber: '04488888888',
        mobileNumber: '09683838485',
        dailyVisitLimit: 20,
        isApproved: false,
        staffIds: [],
        ...this._trailService.createAudit(`${ModifierActions.CREATED} Clinic Clinic A`), 
      },
      { 
        name: "Clinic B",
        location: {
          initial: 'FXQF+535',
          address: 'FXQF+535, Mabini Street Extension, Extension, Cabanatuan City, Nueva Ecija',
          lat: 15.487978237939496,
          lng: 120.97272297780208,
          addressNo: '2B',
          landmark: 'AC Medlinks'
        },
        telephoneNumber: '04488888888',
        mobileNumber: '09683838485',
        dailyVisitLimit: 30,
        isApproved: false,
        staffIds: [],
        ...this._trailService.createAudit(`${ModifierActions.CREATED} Clinic Clinic B`), 
      },
      { 
        name: "Clinic C",
        location: {
          initial: 'FXQC+6MV',
          address: 'FXQC+6MV, General Tinio Street, Cabanatuan City, Nueva Ecija',
          lat: 15.488148835235258,
          lng: 120.97168764517394,
          addressNo: '3B',
          landmark: 'Family Polyclinic'
        },
        telephoneNumber: '04488888888',
        mobileNumber: '09683838485',
        dailyVisitLimit: 25,
        isApproved: false,
        staffIds: [],
        ...this._trailService.createAudit(`${ModifierActions.CREATED} Clinic Clinic C`), 
      },
      { 
        name: "Clinic D",
        location: {
          initial: 'FXG9+M6J',
          address: 'FXG9+M6J, Sanciangco Street Extension, Extension, Cabanatuan City, Nueva Ecija',
          lat: 15.476764914031222,
          lng: 120.96816133242372,
          addressNo: '4D',
          landmark: 'Speed-med Medical Clinic'
        },
        telephoneNumber: '04488888888',
        mobileNumber: '09683838485',
        dailyVisitLimit: 15,
        isApproved: false,
        staffIds: [],
        ...this._trailService.createAudit(`${ModifierActions.CREATED} Clinic Clinic D`), 
      },
      { 
        name: "Clinic E",
        location: {
          initial: 'FXP9-4W',
          address: 'FXP9-4W, Pan-Philippine Hwy, corner Gabaldon Street, Cabanatuan City, Nueva Ecija',
          lat: 15.48539267850393,
          lng: 120.96977837780209,
          addressNo: '5E',
          landmark: 'St. Albert Medical and Diagnostic Clinic'
        },
        telephoneNumber: '04488888888',
        mobileNumber: '09683838485',
        dailyVisitLimit: 5,
        isApproved: false,
        staffIds: [],
        ...this._trailService.createAudit(`${ModifierActions.CREATED} Clinic Clinic E`), 
      },
      { 
        name: "Clinic F",
        location: {
          initial: 'FXVH+56',
          address: 'Wycoco Bldg, Nueva Ecija - Aurora Rd, Cabanatuan City, 3100 Nueva Ecija',
          lat: 15.48539267850393,
          lng: 120.96977837780209,
          addressNo: '6F',
          landmark: 'LIFE PHARMACY AND CLINIC'
        },
        telephoneNumber: '04488888888',
        mobileNumber: '09683838485',
        dailyVisitLimit: 40,
        isApproved: false,
        staffIds: [],
        ...this._trailService.createAudit(`${ModifierActions.CREATED} Clinic Clinic F`), 
      },
    ];

    console.log("SEEDING CLINICS DATA");
    dataToSeed.forEach(async (item) => {
      await addDoc(this.collection, item)
        .then(() => console.log('Clinic seeded successfully'))
        .catch(error => console.error('Error seeding data', error));
    });
  }
}
